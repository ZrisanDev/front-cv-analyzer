"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { PaymentError } from "@/modules/payment/components/PaymentError"

function PaymentErrorContent() {
  const searchParams = useSearchParams()
  const paymentId = searchParams.get("payment_id")
  const status = searchParams.get("status")
  const collectionId = searchParams.get("collection_id")

  const reason = status === "rejected"
    ? "Your payment was rejected. Please check your payment details and try again."
    : status
      ? `Payment could not be completed (status: ${status}). Please try again.`
      : undefined

  return (
    <PaymentError
      reason={reason}
      paymentId={paymentId ?? collectionId ?? undefined}
    />
  )
}

export function PaymentErrorPageContent() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="w-full max-w-md space-y-4">
            <Skeleton className="mx-auto h-12 w-12 rounded-full" />
            <Skeleton className="mx-auto h-6 w-48" />
            <Skeleton className="mx-auto h-4 w-64" />
          </div>
        </div>
      }
    >
      <PaymentErrorContent />
    </Suspense>
  )
}
