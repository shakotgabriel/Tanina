import { Button } from "../ui/button"
import { cn } from "@/lib/utils"

interface PaymentMethodOptionProps {
    method: {
        id: string
        name: string
        icon: React.ReactNode
        description: string
        color: string
        bgColor: string
    }
    selected?: boolean
    onClick?: () => void
}

export const PaymentMethodOption = ({ method, selected, onClick }: PaymentMethodOptionProps) => {
    return (
        <div
            onClick={onClick}
            className={cn(
                "p-4 rounded-xl border cursor-pointer transition-all",
                "hover:border-primary hover:shadow-sm",
                selected && "border-primary bg-primary/5"
            )}
        >
            <div className="flex items-center space-x-4">
                <div className={cn("p-2 rounded-lg", method.bgColor)}>
                    {method.icon}
                </div>
                <div className="flex-1">
                    <h3 className="font-medium">{method.name}</h3>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                </div>
            </div>
        </div>
    )
}