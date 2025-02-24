"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MessageSquare, 
  HelpCircle, 
  Shield, 
  LogOut,
  ChevronRight 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import  { useUser } from "@/hooks/use-users";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  nationality: string;
  idNumber: string;
}

export default function Profile() {
  const router = useRouter();
  const { token, user: authUser } = useAuth();
  const { data: user, isLoading, error } = useUser(authUser?.userId);
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const handleLogout = async () => {
    try {
      // Add actual logout API call here
      console.log('Logging out...');
      // Example: await auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      setStatus('error');
    }
  };

  const handleHelpCenter = () => {
    try {
      router.push('/Help-center');
    } catch (error) {
      console.error('Navigation failed:', error);
      setStatus('error');
    }
  };

  const handleMessageCenter = () => {
    try {
      router.push('/messages');
    } catch (error) {
      console.error('Navigation failed:', error);
      setStatus('error');
    }
  };

  const handlePrivacySettings = () => {
    try {
      router.push('/privacy');
    } catch (error) {
      console.error('Navigation failed:', error);
      setStatus('error');
    }
  };

  const handleSave = async () => {
    setStatus('loading');
    try {
      // Add actual API call here
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatus('success');
      setIsEditing(false);
    } catch (error) {
      console.error('Save failed:', error);
      setStatus('error');
    }
  };

  if(isLoading) {
    return (<p>Loading Profile</p>)
  }

  if(error) {
    return (<p>Error loading Profile</p>)
  }

  console.log("Got a user", user)

  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto pb-20">
      {/* Profile Header */}
      <div className="text-center">
        <div className="w-24 h-24 rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center">
          <span className="text-3xl text-green-600">
          {user?.firstName[0]}
          </span>
        </div>
        <h1 className="text-2xl font-bold text-green-800">
        {user?.firstName} {user?.lastName}
        </h1>
        <p className="text-green-600">Personal Profile</p>
      </div>

      {/* Help & Support */}
      <Card className="border-green-100">
        <CardHeader>
          <CardTitle className="text-green-800">Help & Support</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <button 
            className="w-full flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            onClick={handleHelpCenter}
          >
            <div className="flex items-center space-x-3">
              <HelpCircle className="w-5 h-5 text-green-600" />
              <div className="text-left">
                <h3 className="font-medium text-green-800">Help Center</h3>
                <p className="text-sm text-green-600">FAQs and support guides</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-green-600" />
          </button>

          <button 
            className="w-full flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            onClick={handleMessageCenter}
          >
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-5 h-5 text-green-600" />
              <div className="text-left">
                <h3 className="font-medium text-green-800">Message Center</h3>
                <p className="text-sm text-green-600">View notifications and updates</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-green-600" />
          </button>
        </CardContent>
      </Card>

      {/* Privacy & Security */}
      <Card className="border-green-100">
        <CardHeader>
          <CardTitle className="text-green-800">Privacy & Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <button 
            className="w-full flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            onClick={handlePrivacySettings}
          >
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-green-600" />
              <div className="text-left">
                <h3 className="font-medium text-green-800">Data & Privacy</h3>
                <p className="text-sm text-green-600">Manage your data and privacy settings</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-green-600" />
          </button>

          <button 
            className="w-full flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            onClick={handleLogout}
          >
            <div className="flex items-center space-x-3">
              <LogOut className="w-5 h-5 text-red-600" />
              <div className="text-left">
                <h3 className="font-medium text-red-600">Log Out</h3>
                <p className="text-sm text-red-600">Sign out of your account</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-red-600" />
          </button>
        </CardContent>
      </Card>

      {/* Status Alerts */}
      {status === 'success' && (
        <Alert className="bg-green-50">
          <AlertDescription className="text-green-800">
            Profile updated successfully!
          </AlertDescription>
        </Alert>
      )}

      {status === 'error' && (
        <Alert className="bg-red-50">
          <AlertDescription className="text-red-800">
            Failed to update profile. Please try again.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}