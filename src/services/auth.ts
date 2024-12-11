import type { User, LoginCredentials } from '../types/auth';

const AUTH_STORAGE_KEY = 'auth_user';
const USERS_STORAGE_KEY = 'users_data';

export const AuthService = {
  saveUsers(users: User[]): void {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (error) {
      console.error('Erro ao salvar usuários:', error);
      throw new Error('Não foi possível salvar os usuários');
    }
  },

  loadUsers(): User[] {
    try {
      const data = localStorage.getItem(USERS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      throw new Error('Não foi possível carregar os usuários');
    }
  },

  login(credentials: LoginCredentials): User | null {
    const users = this.loadUsers();
    const user = users.find(
      u => u.email === credentials.email && u.password === credentials.password
    );
    
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      return user;
    }
    
    return null;
  },

  register(userData: Omit<User, 'id'>): User {
    const users = this.loadUsers();
    const existingUser = users.find(u => u.email === userData.email);
    
    if (existingUser) {
      throw new Error('Email já cadastrado');
    }

    const newUser: User = {
      ...userData,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    this.saveUsers([...users, newUser]);
    return newUser;
  },

  logout(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },

  getCurrentUser(): User | null {
    const data = localStorage.getItem(AUTH_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }
};