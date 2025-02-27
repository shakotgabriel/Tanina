export interface User {
  id: string;
  email: string;
  username: string;
  role: 'user' | 'admin' | 'agent' | 'merchant';
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}
