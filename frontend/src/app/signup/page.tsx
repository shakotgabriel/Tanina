"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Mail, Lock, User, Banknote, UserPlus } from "lucide-react"
import Link from "next/link"
import { AuthForm } from "@/components/auth/auth-form"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header Section */}
      <div className="px-6 pt-6 flex-1">
        <Link href="/" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted">
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Link>

        <div className="flex flex-col items-center mt-16">
          <div className="mb-6 p-4 rounded-full bg-green-100">
            <Banknote className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-center">Go ahead and set up</h1>
          <p className="text-sm text-muted-foreground mt-2 text-center">Sign in-up to enjoy the best managing experience</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="px-6 pb-6">
        <AuthForm type="signup" />
      </div>
    </div>
  )
}
