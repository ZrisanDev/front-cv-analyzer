"use client"

import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/modules/shared/lib/constants"
import type { PaymentStatusResponse } from "@/modules/payment/types/payment"

interface PaymentSuccessProps {
  payment: PaymentStatusResponse
}

export function PaymentSuccess({ payment }: PaymentSuccessProps) {
  const formattedDate = payment.dateApproved
    ? new Date(payment.dateApproved).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

  const formattedAmount = payment.amount != null
    ? new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: payment.currency || "USD",
      }).format(payment.amount)
    : null

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle className="size-6 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-xl">Payment Successful!</CardTitle>
          <CardDescription>
            Your payment has been confirmed and your CV analysis is being processed.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <Alert className="border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950/50 dark:text-green-300">
            <CheckCircle className="size-4" />
            <AlertDescription>
              Your analysis is ready to view once processing completes.
            </AlertDescription>
          </Alert>

          {(formattedAmount || formattedDate) && (
            <div className="rounded-lg border p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Payment ID</span>
                <span className="font-mono text-xs">{payment.paymentId}</span>
              </div>
              {formattedAmount && (
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium">{formattedAmount}</span>
                </div>
              )}
              {formattedDate && (
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-muted-foreground">Approved</span>
                  <span>{formattedDate}</span>
                </div>
              )}
            </div>
          )}

          <Button asChild className="w-full" size="lg">
            <Link href={payment.analysisId ? `${ROUTES.RESULTS}?id=${payment.analysisId}` : ROUTES.RESULTS}>
              View Analysis Results
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
