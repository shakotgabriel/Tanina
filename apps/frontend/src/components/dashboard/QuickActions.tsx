import { ArrowUpRight, Handshake, Receipt, MoreHorizontal } from "lucide-react";
import router from "next/router";
import { Button } from "../ui/button";

export const QuickActions = () => {
    return (
        <div className="grid grid-cols-4 gap-4">
          <Button
            variant="ghost"
            className="flex flex-col items-center space-y-1 h-auto py-4"
            onClick={() => router.push('/user/wallet/transfer')}
          >
            <div className="rounded-full bg-primary/10 p-3">
              <ArrowUpRight className="h-5 w-5" />
            </div>
            <span className="text-xs">Send</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center space-y-1 h-auto py-4"
            onClick={() => router.push('/user/wallet/request')}
          >
            <div className="rounded-full bg-primary/10 p-3">
              <Handshake className="h-5 w-5" />
            </div>
            <span className="text-xs">Request</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center space-y-1 h-auto py-4"
            onClick={() => router.push('/user/bills')}
          >
            <div className="rounded-full bg-primary/10 p-3">
              <Receipt className="h-5 w-5" />
            </div>
            <span className="text-xs">Bills</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center space-y-1 h-auto py-4"
            onClick={() => router.push('/user/more')}
          >
            <div className="rounded-full bg-primary/10 p-3">
              <MoreHorizontal className="h-5 w-5" />
            </div>
            <span className="text-xs">More</span>
          </Button>
        </div>
    )
};