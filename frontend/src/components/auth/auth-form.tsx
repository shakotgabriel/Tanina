"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { KeyRound, LogIn, UserPlus, Mail, Lock } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useLogin } from "@/hooks/use-auth"

interface AuthFormProps {
  type: "login" | "signup"
}

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type LoginFormData = z.infer<typeof loginSchema>

export function AuthForm({ type }: AuthFormProps) {
  const [error, setError] = useState("")
  const pathname = usePathname()
  const router = useRouter()

  const login = useLogin()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login.mutateAsync(data)
      router.push('/user/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log in')
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg max-w-md mx-auto w-full">
      <div className="p-5 flex flex-col">
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

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                {...register("email")}
                type="email" 
                placeholder="Email Address" 
                className="pl-10 py-6 rounded-full bg-gray-50 border-0" 
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                {...register("password")}
                type="password"
                placeholder="Password"
                className="pl-10 py-6 rounded-full bg-gray-50 border-0"
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-green-600 text-white hover:bg-green-700 rounded-full py-4 h-auto font-medium flex items-center justify-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Signing in..."
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Login
              </>
            )}
          </Button>

          {type === "login" && (
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/signup" className="text-green-600 hover:underline">
                Sign up
              </Link>
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
