"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    if (formData.password !== formData.confirmPassword) {
      setStatus('error');
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      // API call here
      console.log('Signup attempt:', formData);
      setStatus('idle');
    } catch (error) {
      setStatus('error');
      setErrorMessage('Failed to create account. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold text-green-800">Create Account</CardTitle>
          <p className="text-sm text-green-600">Join Tanina for secure digital payments</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-green-800">First Name</label>
                <Input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full border-green-100 focus:border-green-500 focus:ring-green-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-green-800">Last Name</label>
                <Input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full border-green-100 focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-green-800">Email</label>
              <Input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border-green-100 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-green-800">Phone Number</label>
              <Input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border-green-100 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-green-800">Password</label>
              <Input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full border-green-100 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-green-800">Confirm Password</label>
              <Input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full border-green-100 focus:border-green-500 focus:ring-green-500"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Creating Account...' : 'Create Account'}
            </Button>

            {status === 'error' && (
              <Alert className="bg-red-50 text-red-700">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <div className="text-center text-sm text-green-600">
              Already have an account?{' '}
              <Link href="/auth/login" className="font-medium text-green-700 hover:text-green-800">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}