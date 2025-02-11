import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UseFormReturn } from "react-hook-form"

// Mock bank accounts for demo
const bankAccounts = [
    { id: '1', name: 'KCB Bank', accountNumber: '1234567890' },
    { id: '2', name: 'Equity Bank', accountNumber: '0987654321' },
    { id: '3', name: 'Stanbic Bank', accountNumber: '5678901234' },
]

interface BankTransferFormProps {
    form: UseFormReturn<any>
}

export const BankTransferForm = ({ form }: BankTransferFormProps) => {
    return (
        <div className="space-y-4">
            <FormField
                control={form.control}
                name="bankAccount"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Select Bank Account</FormLabel>
                        <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                        >
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a bank account" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {bankAccounts.map((account) => (
                                    <SelectItem key={account.id} value={account.id}>
                                        {account.name} - {account.accountNumber}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter amount" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}
