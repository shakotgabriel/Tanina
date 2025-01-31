"use client"
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  Lock,
  Fingerprint,
  UserCheck,
  Globe,
  Key,
  ChevronRight,
  AlertTriangle
} from "lucide-react";

const SecurityPrivacy = () => {
  interface Feature {
    title: string;
    icon: React.JSX.Element;
    description: string;
    details: string;
  }
  
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  const securityFeatures = [
    {
      title: "Biometric Authentication",
      icon: <Fingerprint className="w-5 h-5 text-green-600" />,
      description: "Enhanced security ",
      details: "Access your account securely using biometric verification methods"
    },
    {
      title: "Two-Factor Authentication",
      icon: <Key className="w-5 h-5 text-green-600" />,
      description: "Additional layer of account protection",
      details: "Secure your account with SMS verification and authenticator apps"
    },
    {
      title: "KYC Verification",
      icon: <UserCheck className="w-5 h-5 text-green-600" />,
      description: "Thorough identity verification process",
      details: "Complete verification for enhanced account security"
    },
    {
      title: "Transaction Security",
      icon: <Shield className="w-5 h-5 text-green-600" />,
      description: "End-to-end encrypted transactions",
      details: "All financial transactions are protected with advanced encryption"
    },
    {
      title: "Data Protection",
      icon: <Lock className="w-5 h-5 text-green-600" />,
      description: "Comprehensive data privacy measures",
      details: "Your personal information is protected with industry-standard security"
    },
    {
      title: "International Standards",
      icon: <Globe className="w-5 h-5 text-green-600" />,
      description: "Compliance with global security standards",
      details: "Following international security protocols and regulations"
    }
  ];

  return (
    <div className="p-4 space-y-6 max-w-2xl mx-auto">
      <Card className="border-green-100">
        <CardHeader>
          <CardTitle className="text-green-800 flex items-center gap-2">
            <Shield className="w-6 h-6 text-green-600" />
            Security & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {securityFeatures.map((feature, index) => (
            <Button 
              key={index}
              variant="ghost"
              className="w-full flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors h-auto"
              onClick={() => setSelectedFeature(feature)}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  {feature.icon}
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-green-800">{feature.title}</h3>
                  <p className="text-sm text-green-600">{feature.description}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-green-600" />
            </Button>
          ))}
        </CardContent>
      </Card>

      {selectedFeature && (
        <Alert className="bg-green-50 border-green-100">
          <AlertTriangle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {selectedFeature.details}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default SecurityPrivacy;