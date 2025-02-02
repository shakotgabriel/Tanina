"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"

const signupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number").optional(),
})

type SignupFormData = z.infer<typeof signupSchema>

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupFormData) => {
    try {
      const response = await fetch('http://localhost:8000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Something went wrong')
      }

      localStorage.setItem('access_token', result.access_token)
      router.push('/user/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pb-20 pt-6 px-4 md:pt-12 md:pb-12"> {/* Added pb-20 for bottom nav space */}
        <div className="w-full max-w-sm mx-auto space-y-4"> {/* Reduced space-y-6 to space-y-4 */}
          <div className="space-y-1 text-center"> {/* Reduced space-y-2 to space-y-1 */}
            <h1 className="text-xl font-bold md:text-3xl">Create an Account</h1>
            <p className="text-xs text-gray-500 md:text-base">Enter your information to get started</p>
          </div>

          {error && (
            <Alert variant="destructive" className="text-xs">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3"> {/* Reduced space-y-4 to space-y-3 */}
            <div className="space-y-3"> {/* Single column for mobile */}
              <div className="space-y-1">
                <Input
                  {...register("firstName")}
                  placeholder="First Name"
                  type="text"
                  className="h-11" // Increased touch target
                />
                {errors.firstName && (
                  <p className="text-xs text-red-500">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <Input
                  {...register("lastName")}
                  placeholder="Last Name"
                  type="text"
                  className="h-11"
                />
                {errors.lastName && (
                  <p className="text-xs text-red-500">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <Input
                {...register("email")}
                placeholder="Email"
                type="email"
                className="h-11"
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <div className="relative">
                <Input
                  {...register("password")}
                  placeholder="Password"
                  type={showPassword ? "text" : "password"}
                  className="h-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none touch-manipulation"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Input
                {...register("phoneNumber")}
                placeholder="Phone Number"
                type="tel"
                className="h-11"
              />
              {errors.phoneNumber && (
                <p className="text-xs text-red-500">{errors.phoneNumber.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 mt-4" // Increased height and adjusted margin
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>

          <p className="text-center text-xs text-gray-500 pt-2">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}