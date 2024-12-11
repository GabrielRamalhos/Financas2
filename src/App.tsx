import React from 'react';
import { Dashboard } from './components/Dashboard';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { ImportExport } from './components/ImportExport';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterModal } from './components/auth/RegisterModal';
import { useTransactions } from './hooks/useTransactions';
import { useAuth } from './hooks/useAuth';
import { AppHeader } from './components/layout/AppHeader';
import { ErrorAlert } from './components/common/ErrorAlert';
import { LoadingSpinner } from './components/common/LoadingSpinner';

export function App() {
  const { 
    transactions, 
    isLoading: isLoadingTransactions, 
    error: transactionError,
    addTransaction, 
    deleteTransaction,
    importTransactions,
    exportTransactions
  } = useTransactions();

  const {
    user,
    loading: isLoadingAuth,
    error: authError,
    login,
    register,
    logout
  } = useAuth();

  const [showRegisterModal, setShowRegisterModal] = React.useState(false);

  if (isLoadingAuth || isLoadingTransactions) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <>
        <LoginForm
          error={authError}
          onLogin={login}
          onRegisterClick={() => setShowRegisterModal(true)}
        />
        <RegisterModal
          isOpen={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
          onRegister={register}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AppHeader user={user} onLogout={logout} />
        
        {transactionError && <ErrorAlert message={transactionError} />}

        <ImportExport 
          onExport={exportTransactions}
          onImport={importTransactions}
        />

        <Dashboard transactions={transactions} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TransactionForm onAddTransaction={addTransaction} />
          <TransactionList 
            transactions={transactions}
            onDeleteTransaction={deleteTransaction}
          />
        </div>
      </div>
    </div>
  );
}

export default App;