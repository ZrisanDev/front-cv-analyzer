"use client"

import { Clock, RefreshCw } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import type { PaymentStatusResponse } from "@/modules/payment/types/payment"

interface PaymentPendingProps {
  payment: PaymentStatusResponse
  isRefetching: boolean
  onRefresh: () => void
}

export function PaymentPending({ payment, isRefetching, onRefresh }: PaymentPendingProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
            <Clock className="size-6 animate-pulse text-amber-600 dark:text-amber-400" />
          </div>
          <CardTitle className="text-xl">Payment Pending</CardTitle>
          <CardDescription>
            Your payment is being processed. This usually takes a few seconds.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <Alert className="border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
            <Clock className="size-4" />
            <AlertDescription>
              The payment status is being verified automatically. You can also refresh manually.
            </AlertDescription>
          </Alert>

          <div className="rounded-lg border p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Payment ID</span>
              <span className="font-mono text-xs">{payment.paymentId}</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <span className="size-1.5 animate-pulse rounded-full bg-amber-500" />
                Pending
              </span>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            This page will automatically refresh. No need to close it.
          </div>

          <Button
            variant="outline"
            className="w-full"
            size="lg"
            onClick={onRefresh}
            disabled={isRefetching}
          >
            <RefreshCw className={`size-4 ${isRefetching ? "animate-spin" : ""}`} />
            {isRefetching ? "Checking..." : "Check Status Now"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
