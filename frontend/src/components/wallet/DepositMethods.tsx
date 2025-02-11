"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    ArrowLeft,
    Wallet,
    Phone,
    Building2,
    BanknoteIcon,
    X as CloseIcon
} from "lucide-react"
import { useRouter } from 'next/navigation'
import { PaymentMethodOption } from "@/components/wallet/PaymentMethodOption"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form } from "@/components/ui/form"
import { MobileMoneyForm } from "./payment-methods/MobileMoneyForm"
import { BankTransferForm } from "./payment-methods/BankTransferForm"
import { AgentForm } from "./payment-methods/AgentForm"

const mainDepositMethods = [
    {
        id: 'mobile_money',
        name: 'Mobile Money',
        icon: <Phone className="h-5 w-5" />,
        description: 'MTN MOMO, MGURUSH',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10'
    },
    {
        id: 'bank',
        name: 'Bank Transfer',
        icon: <Building2 className="h-5 w-5" />,
        description: 'Direct bank deposit',
        color: 'text-blue-500',
        bgColor: 'bg-blue-500/10'
    },
    {
        id: 'agent',
        name: 'Tanina Agent',
        icon: <Wallet className="h-5 w-5" />,
        description: 'Visit nearby agent',
        color: 'text-purple-500',
        bgColor: 'bg-purple-500/10'
    }
];

const mobileMoneyOptions = [
    {
        id: 'mtn',
        name: 'MTN MOMO Money',
        icon: <Phone className="h-5 w-5" />,
        description: 'Deposit via MTN Mobile Money',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10'
    },
    {
        id: 'mgurush',
        name: 'MGURUSH Money',
        icon: <Phone className="h-5 w-5" />,
        description: 'Deposit via MGURUSH',
        color: 'text-green-500',
        bgColor: 'bg-green-500/10'
    }
];

const formSchema = z.object({
    mainMethod: z.enum(['mobile_money', 'bank', 'agent'], {
        required_error: "Please select a payment method",
    }),
    mobileMoneyProvider: z.enum(['mtn', 'mgurush']).optional(),
    amount: z.string().min(1, "Amount is required").regex(/^\d+$/, "Must be a valid number"),
    bankAccount: z.string().optional(),
})

export const DepositMethods = () => {
    const [step, setStep] = useState(1)
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            mainMethod: undefined,
            mobileMoneyProvider: undefined,
            amount: "",
            bankAccount: undefined,
        },
    })

    const selectedMainMethod = form.watch("mainMethod")
    const selectedMobileProvider = form.watch("mobileMoneyProvider")

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        console.log("Form submitted:", values)
    }

    const handleCancel = () => {
        router.back()
    }

    const renderPaymentForm = () => {
        switch (selectedMainMethod) {
            case 'mobile_money':
                return <MobileMoneyForm form={form} />
            case 'bank':
                return <BankTransferForm form={form} />
            case 'agent':
                return <AgentForm form={form} />
            default:
                return null
        }
    }

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-4">
                        <h2 className="text-sm font-medium text-muted-foreground">Select Payment Method</h2>
                        <div className="grid gap-4">
                            {mainDepositMethods.map((method) => (
                                <PaymentMethodOption
                                    key={method.id}
                                    method={method}
                                    selected={selectedMainMethod === method.id}
                                    onClick={() => {
                                        form.setValue("mainMethod", method.id as any)
                                        if (method.id === 'mobile_money') {
                                            setStep(2)
                                        } else {
                                            setStep(3)
                                        }
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )
            case 2:
                return (
                    <div className="space-y-4">
                        <div className="flex items-center mb-6">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                    setStep(1)
                                    form.setValue("mobileMoneyProvider", undefined)
                                }}
                                className="mr-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <h2 className="text-sm font-medium text-muted-foreground">Select Mobile Money Provider</h2>
                        </div>
                        <div className="grid gap-4">
                            {mobileMoneyOptions.map((option) => (
                                <PaymentMethodOption
                                    key={option.id}
                                    method={option}
                                    selected={selectedMobileProvider === option.id}
                                    onClick={() => {
                                        form.setValue("mobileMoneyProvider", option.id as any)
                                        setStep(3)
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )
            case 3:
                return (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <div className="flex items-center mb-6">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => {
                                        if (selectedMainMethod === 'mobile_money') {
                                            setStep(2)
                                        } else {
                                            setStep(1)
                                        }
                                    }}
                                    className="mr-2"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                                <h2 className="text-sm font-medium text-muted-foreground">Enter Details</h2>
                            </div>

                            {renderPaymentForm()}

                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={handleCancel}
                                >
                                    <CloseIcon className="mr-2 h-4 w-4" />
                                    Cancel
                                </Button>
                                <Button type="submit" className="flex-1">
                                    <BanknoteIcon className="mr-2 h-4 w-4" />
                                    Deposit
                                </Button>
                            </div>
                        </form>
                    </Form>
                )
            default:
                return null
        }
    }

    return (
        <div className="max-w-md mx-auto">
            {renderStepContent()}
        </div>
    )
}