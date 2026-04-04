"use client"

import Link from "next/link"
import { XCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/modules/shared/lib/constants"

interface PaymentErrorProps {
  reason?: string
  paymentId?: string
}

export function PaymentError({ reason, paymentId }: PaymentErrorProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <XCircle className="size-6 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-xl">Payment Failed</CardTitle>
          <CardDescription>
            Your payment could not be processed. Please try again.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <Alert variant="destructive">
            <XCircle className="size-4" />
            <AlertDescription>
              {reason || "An error occurred during payment processing. Your card was not charged."}
            </AlertDescription>
          </Alert>

          {paymentId && (
            <div className="rounded-lg border p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Payment ID</span>
                <span className="font-mono text-xs">{paymentId}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Button asChild className="w-full" size="lg">
              <Link href={ROUTES.ANALYZE}>Try Again</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link href={ROUTES.DASHBOARD}>Back to Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
