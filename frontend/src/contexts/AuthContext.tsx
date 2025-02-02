"use client"
import React, { createContext, useContext, useEffect, useState } from 'react';
import { decodeJwt } from '@/lib/utils/jwt';

interface AuthContextType {
  token: string | null;
  user: any | null;
}

const AuthContext = createContext<AuthContextType>({ token: null, user: null });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [authUser, setAuthUser] = useState<any | null>(null);

  useEffect(() => {
    // Get token from localStorage on mount
    const storedToken = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');
    setToken(storedToken);

    if (storedToken && storedUser) {
      const decoded = decodeJwt(storedToken);
      console.log("We've decoded the token!", decoded)
      setAuthUser(decoded);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, user: authUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
