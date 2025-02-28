"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, GraduationCap, School, Building2, BookOpen, DollarSign } from "lucide-react"
import { useRouter } from "next/navigation"

const educationCategories = [
  {
    id: 'school',
    name: 'School Fees',
    icon: <School className="h-5 w-5" />,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    id: 'university',
    name: 'University Tuition',
    icon: <Building2 className="h-5 w-5" />,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
 
]

const Education = () => {
  interface EducationCategory {
    id: string;
    name: string;
    icon: JSX.Element;
    color: string;
    bgColor: string;
  }
  
  const [selectedCategory, setSelectedCategory] = useState<EducationCategory | null>(null)
  const [studentId, setStudentId] = useState("")
  const [institution, setInstitution] = useState("")
  const [amount, setAmount] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const router = useRouter()

  const handlePayment = () => {
    // Handle payment processing
    console.log({
      category: selectedCategory,
      studentId,
      institution,
      amount,
      phoneNumber
    })
  }

  return (
    <ScrollArea className="h-screen">
      <div className="p-6 space-y-6 bg-background min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10 border-0 bg-muted hover:bg-muted/80"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </Button>
            <div className="space-y-1">
              <h1 className="text-lg font-semibold text-foreground">Education Payment</h1>
              <p className="text-sm text-muted-foreground">Pay school fees and tuition</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-red-500" />
          </div>
        </div>

        {/* Payment Categories */}
        <div className="grid grid-cols-1 gap-4">
          {educationCategories.map((category) => (
            <Button
              key={category.id}
              variant="ghost"
              className={`h-20 rounded-2xl flex items-center justify-start gap-4 px-4 ${
                selectedCategory?.id === category.id 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted hover:bg-muted/80"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              <div className={`w-12 h-12 rounded-xl ${category.bgColor} flex items-center justify-center`}>
                <div className={category.color}>{category.icon}</div>
              </div>
              <span className="text-base font-medium">{category.name}</span>
            </Button>
          ))}
        </div>

        {selectedCategory && (
          <>
            {/* Student ID */}
            <Card className="shadow-sm border-0 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-foreground">Student ID/Registration Number</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="h-12"
                  placeholder="Enter student ID"
                />
              </CardContent>
            </Card>

            {/* Institution */}
            <Card className="shadow-sm border-0 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-foreground">Institution Name</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="h-12"
                  placeholder="Enter institution name"
                />
              </CardContent>
            </Card>

            {/* Amount */}
            <Card className="shadow-sm border-0 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-foreground">Amount</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-xl font-bold h-12 pl-8"
                    placeholder="0.00"
                  />
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            {/* Phone Number */}
            <Card className="shadow-sm border-0 rounded-2xl">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-foreground">Phone Number</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="h-12"
                  placeholder="Enter phone number"
                  type="tel"
                />
              </CardContent>
            </Card>

            {/* Payment Button */}
            <Button
              onClick={handlePayment}
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Pay ${amount || "0.00"}
            </Button>
          </>
        )}
      </div>
    </ScrollArea>
  )
}

export default Education