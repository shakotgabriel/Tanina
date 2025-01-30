"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Shield, 
  ChevronLeft,
  Eye,
  Bell,
  Smartphone,
  Globe,
  Lock,
  Download,
  ChevronRight
} from "lucide-react"

const DataPrivacy = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleBack = () => {
    window.history.back()
  }

  const handleSettingClick = (setting: string) => {
    setStatus('loading')
    setTimeout(() => {
      setStatus('success')
      setTimeout(() => setStatus('idle'), 2000)
    }, 500)
  }

  const handleDataDownload = () => {
    console.log('Downloading personal data...')
  }

  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full w-10 h-10 bg-green-50 hover:bg-green-100"
          onClick={handleBack}
        >
          <ChevronLeft className="h-5 w-5 text-green-600" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-green-800">Data & Privacy</h1>
          <p className="text-green-600">Manage your privacy settings</p>
        </div>
      </div>

      {/* Privacy Settings */}
      <Card className="border-green-100">
        <CardHeader>
          <CardTitle className="text-green-800">Privacy Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            variant="ghost"
            className="w-full flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors h-auto"
            onClick={() => handleSettingClick('profileVisibility')}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Eye className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-green-800">Profile Visibility</h3>
                <p className="text-sm text-green-600">Control who can see your profile</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-green-600" />
          </Button>

          <Button 
            variant="ghost"
            className="w-full flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors h-auto"
            onClick={() => handleSettingClick('notifications')}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Bell className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-green-800">Push Notifications</h3>
                <p className="text-sm text-green-600">Manage notification preferences</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-green-600" />
          </Button>

          <Button 
            variant="ghost"
            className="w-full flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors h-auto"
            onClick={() => handleSettingClick('locationServices')}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-green-800">Location Services</h3>
                <p className="text-sm text-green-600">Control location tracking</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-green-600" />
          </Button>

          <Button 
            variant="ghost"
            className="w-full flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors h-auto"
            onClick={() => handleSettingClick('dataSharing')}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Globe className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-green-800">Data Sharing</h3>
                <p className="text-sm text-green-600">Control data sharing with partners</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-green-600" />
          </Button>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="border-green-100">
        <CardHeader>
          <CardTitle className="text-green-800">Security</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            variant="ghost"
            className="w-full flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors h-auto"
            onClick={() => handleSettingClick('twoFactor')}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Lock className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-green-800">Two-Factor Authentication</h3>
                <p className="text-sm text-green-600">Add an extra layer of security</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-green-600" />
          </Button>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="border-green-100">
        <CardHeader>
          <CardTitle className="text-green-800">Your Data</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            variant="ghost"
            className="w-full flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors h-auto"
            onClick={handleDataDownload}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Download className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-left">
                <h3 className="font-medium text-green-800">Download Your Data</h3>
                <p className="text-sm text-green-600">Get a copy of your personal data</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-green-600" />
          </Button>
        </CardContent>
      </Card>

      {/* Status Alerts */}
      {status === 'success' && (
        <Alert className="bg-green-50 border-green-100">
          <AlertDescription className="text-green-800">
            Settings updated successfully!
          </AlertDescription>
        </Alert>
      )}

      {status === 'error' && (
        <Alert className="bg-red-50 border-red-100">
          <AlertDescription className="text-red-800">
            Failed to update settings. Please try again.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

export default DataPrivacy