"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { KeyRound, LogIn, UserPlus, Mail } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface AuthFormProps {
  type: "login" | "signup"
}

export function AuthForm({ type }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [authMethod, setAuthMethod] = useState<"pin" | "email">("pin")
  const pathname = usePathname()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg max-w-md mx-auto w-full aspect-[3/4]">
      <div className="p-5 h-full flex flex-col">
        <div className="border border-gray-50 rounded-full flex mb-6 p-0.5">
          <Link 
            href="/login"
            className={`flex-1 py-2.5 text-center rounded-full font-medium flex items-center justify-center gap-2 transition-all ${
              pathname === "/login" 
                ? "bg-white shadow-md" 
                : "text-muted-foreground hover:text-green-600"
            }`}
          >
            <LogIn className="w-4 h-4" />
            Login
          </Link>
          <Link 
            href="/signup"
            className={`flex-1 py-2.5 text-center rounded-full font-medium flex items-center justify-center gap-2 transition-all ${
              pathname === "/signup"
                ? "bg-white shadow-md"
                : "text-muted-foreground hover:text-green-600"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Register
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          {authMethod === "pin" ? (
            <div className="relative mb-4">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Enter PIN Code"
                maxLength={4}
                className="pl-10 py-6 rounded-full bg-gray-50 border-0 text-lg tracking-[0.5em] text-center font-medium placeholder:text-center placeholder:tracking-normal placeholder:text-base"
              />
            </div>
          ) : (
            <div className="space-y-4 mb-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground rounded-md" />
                <Input 
                  type="email" 
                  placeholder="Email Address" 
                  className="pl-10 py-6 rounded-full bg-gray-50 border-0" 
                />
              </div>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Password"
                  className="pl-10 py-6 rounded-full bg-gray-50 border-0"
                />
              </div>
            </div>
          )}

          <div className="relative mb-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full py-4 h-auto font-medium flex items-center justify-center gap-2 hover:bg-gray-50 rounded-full border-gray-200 mb-6"
            onClick={() => setAuthMethod(authMethod === "pin" ? "email" : "pin")}
          >
            {authMethod === "pin" ? (
              <>
                <Mail className="w-5 h-5" />
                Continue with Email
              </>
            ) : (
              <>
                <KeyRound className="w-5 h-5" />
                Continue with PIN
              </>
            )}
          </Button>

          <div className="flex-1" />

          <Button
            type="submit"
            className="w-full bg-green-600 text-white hover:bg-green-700 rounded-full py-4 h-auto font-medium flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              type === "login" ? "Signing in..." : "Creating account..."
            ) : (
              <>
                {type === "login" ? (
                  <>
                    <LogIn className="w-5 h-5" />
                    Login
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Create account
                  </>
                )}
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
