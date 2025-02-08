"use client"
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { decodeJwt } from '@/lib/utils/jwt';
import { useCurrentUser, AuthUser } from '@/hooks/use-auth';
import { useRouter, usePathname } from 'next/navigation';

interface DecodedToken {
  sub: number;
  email: string;
  role: string;
  exp: number;
}

interface AuthContextType {
  token: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType>({ 
  token: null, 
  user: null, 
  isLoading: true,
  isAuthenticated: false,
  error: null 
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();

  const checkTokenExpiration = useCallback((token: string) => {
    try {
      const decodedResult = decodeJwt(token);
      if (!decodedResult || 
          typeof decodedResult !== 'object' ||
          !('exp' in decodedResult)) {
        throw new Error('Invalid token format');
      }

      const expirationTime = Number(decodedResult.exp) * 1000;
      const currentTime = Date.now();
      const timeUntilExpiration = expirationTime - currentTime;

      // If token is expired or about to expire in the next 5 minutes
      if (timeUntilExpiration <= 300000) {
        return false;
      }
      return true;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return false;
    }
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setToken(null);
    setError(null);
    if (!pathname?.startsWith('/auth/')) {
      router.push('/auth/login');
    }
  }, [router, pathname]);

  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    
    if (!storedToken) {
      setIsLoading(false);
      if (!pathname?.startsWith('/auth/')) {
        router.push('/auth/login');
      }
      return;
    }

    if (!checkTokenExpiration(storedToken)) {
      handleLogout();
      return;
    }

    setToken(storedToken);
    setIsLoading(false);
  }, [checkTokenExpiration, handleLogout, router, pathname]);

  // Update loading state based on user query
  useEffect(() => {
    setIsLoading(isUserLoading);
  }, [isUserLoading]);

  const isAuthenticated = !!token && !!user;

  // Redirect to dashboard if authenticated and on auth pages
  useEffect(() => {
    if (isAuthenticated && pathname?.startsWith('/auth/')) {
      router.push('/user/dashboard');
    }
  }, [isAuthenticated, pathname, router]);

  const contextValue: AuthContextType = {
    token,
    user: user || null,
    isLoading,
    isAuthenticated,
    error
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
