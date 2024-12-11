import React from 'react';
import { LogOut } from 'lucide-react';
import type { User } from '../../types/auth';

interface AppHeaderProps {
  user: User;
  onLogout: () => void;
}

export function AppHeader({ user, onLogout }: AppHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-gray-900">Finanças do Casal</h1>
      <div className="flex items-center gap-4">
        <span className="text-gray-600">Olá, {user.name}</span>
        <button
          onClick={onLogout}
          className="flex items-center px-4 py-2 text-red-600 hover:text-red-800"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Sair
        </button>
      </div>
    </div>
  );
}