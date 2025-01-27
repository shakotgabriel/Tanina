"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      // API call here
      console.log('Login attempt:', formData);
      setStatus('idle');
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold text-green-800">Welcome Back</CardTitle>
          <p className="text-sm text-green-600">Sign in to your Tanina account</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-green-800">Email</label>
              <Input
                type="email"
                placeholder="you@example.com"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border-green-100 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-green-800">Password</label>
                <Link href="/auth/reset-password" className="text-sm text-green-600 hover:text-green-700">
                  Forgot password?
                </Link>
              </div>
              <Input
                type="password"
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full border-green-100 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Signing in...' : 'Sign In'}
            </Button>

            {status === 'error' && (
              <Alert className="bg-red-50 text-red-700">
                <AlertDescription>
                  Invalid email or password. Please try again.
                </AlertDescription>
              </Alert>
            )}

            <div className="text-center text-sm text-green-600">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="font-medium text-green-700 hover:text-green-800">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}