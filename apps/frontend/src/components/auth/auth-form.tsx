"use client"

import { useState, useEffect, useContext } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { KeyRound, LogIn, UserPlus, Mail, Lock } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useForm, FieldErrors } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useLogin, useSignup } from "@/hooks/use-auth"
import { AuthContext } from "@/contexts/AuthContext"

interface AuthFormProps {
  type: "login" | "signup"
}

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

const signupSchema = loginSchema.extend({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  confirmPassword: z.string().min(8, "Confirm your password")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>
type SignupFormData = z.infer<typeof signupSchema>

export function AuthForm({ type }: AuthFormProps) {
  const [error, setError] = useState("")
  const pathname = usePathname()
  const router = useRouter()

  const login = useLogin()
  const signup = useSignup()
  const { isAuthenticated } = useContext(AuthContext)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<SignupFormData | LoginFormData>({
    resolver: zodResolver(type === "login" ? loginSchema : signupSchema),
    mode: "onChange"
  })

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/user/dashboard')
    }
  }, [isAuthenticated, router])

  useEffect(() => {
    reset()
    setError("")
  }, [type, reset])

  const onSubmit = async (data: LoginFormData | SignupFormData) => {
    try {
      setError("")
      if (type === "login") {
        await login.mutateAsync(data as LoginFormData)
      } else {
        await signup.mutateAsync(data as SignupFormData)
      }
      router.push('/user/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg max-w-md mx-auto w-full">
      <div className="p-5 flex flex-col">
        <div className="border border-gray-50 rounded-full flex mb-6 p-0.5">
          <Link 
            href="/auth/login"
            className={`flex-1 py-2.5 text-center rounded-full font-medium flex items-center justify-center gap-2 transition-all ${
              type === "login"
                ? "bg-white shadow-md" 
                : "text-muted-foreground hover:text-green-600"
            }`}
          >
            <LogIn className="w-4 h-4" />
            Login
          </Link>
          <Link 
            href="/auth/signup"
            className={`flex-1 py-2.5 text-center rounded-full font-medium flex items-center justify-center gap-2 transition-all ${
              type === "signup"
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
            {type === "signup" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <Input 
                      {...register("firstName")}
                      placeholder="First Name" 
                      className="py-6 rounded-full bg-gray-50 border-0" 
                    />
                    {type === "signup" && (errors as FieldErrors<SignupFormData>).firstName && (
                      <p className="text-sm text-red-500 mt-1">
                        {(errors as FieldErrors<SignupFormData>).firstName?.message}
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <Input 
                      {...register("lastName")}
                      placeholder="Last Name" 
                      className="py-6 rounded-full bg-gray-50 border-0" 
                    />
                    {type === "signup" && (errors as FieldErrors<SignupFormData>).lastName && (
                      <p className="text-sm text-red-500 mt-1">
                        {(errors as FieldErrors<SignupFormData>).lastName?.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="relative">
                  <Input 
                    {...register("phoneNumber")}
                    placeholder="Phone Number" 
                    className="py-6 rounded-full bg-gray-50 border-0" 
                  />
                  {type === "signup" && (errors as FieldErrors<SignupFormData>).phoneNumber && (
                    <p className="text-sm text-red-500 mt-1">
                      {(errors as FieldErrors<SignupFormData>).phoneNumber?.message}
                    </p>
                  )}
                </div>
              </>
            )}
            
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

            {type === "signup" && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  {...register("confirmPassword")}
                  type="password"
                  placeholder="Confirm Password"
                  className="pl-10 py-6 rounded-full bg-gray-50 border-0"
                />
                {type === "signup" && (errors as FieldErrors<SignupFormData>).confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">
                    {(errors as FieldErrors<SignupFormData>).confirmPassword?.message}
                  </p>
                )}
              </div>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full py-6 rounded-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
            ) : (
              type === "login" ? "Sign In" : "Create Account"
            )}
          </Button>

          {type === "login" && (
            <p className="text-center text-sm text-muted-foreground">
              <Link href="/auth/forgot-password" className="hover:text-green-600">
                Forgot your password?
              </Link>
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
