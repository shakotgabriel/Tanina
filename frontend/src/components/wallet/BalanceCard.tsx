"use client"
import { formatCurrency } from "@/lib/utils"
import { Plus } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"
import { useRouter } from "next/navigation";

export const BalanceCard = ({ balance }: { balance: number }) => {
    const router = useRouter();
    return (
        <Card className="bg-gradient-to-br from-primary to-primary-foreground text-primary-foreground">
          <CardContent className="pt-6 pb-6">
            <h2 className="text-sm text-primary-foreground/80 mb-2">Your Balance</h2>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold">{formatCurrency(balance || 0)}</p>
              <Button 
                className="bg-background text-foreground hover:bg-accent rounded-xl"
                onClick={() => router.push('/user/wallet/deposit')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Top Up
              </Button>
            </div>
          </CardContent>
        </Card>
    )   
}
