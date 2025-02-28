"use client"
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-auth';
import { NavigationBar } from '@/components/NavigationBar';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: user, isLoading, error } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && !user && !pathname?.startsWith('/auth/')) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBar />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
