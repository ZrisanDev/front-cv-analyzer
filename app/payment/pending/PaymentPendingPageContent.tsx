"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { PaymentPending } from "@/modules/payment/components/PaymentPending"
import { PaymentSuccess } from "@/modules/payment/components/PaymentSuccess"
import { PaymentError } from "@/modules/payment/components/PaymentError"
import { usePaymentStatus } from "@/modules/payment/hooks/usePayment"
import { ROUTES } from "@/modules/shared/lib/constants"

function PaymentPendingContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const paymentId = searchParams.get("payment_id")

  const { data: payment, isLoading, isRefetching, refetch, error } = usePaymentStatus(paymentId, {
    pollPending: true,
    pollingInterval: 5000,
  })

  // Auto-redirect when status changes from pending
  useEffect(() => {
    if (!payment) return

    if (payment.status === "approved") {
      router.replace(`${ROUTES.PAYMENT_SUCCESS}?payment_id=${paymentId}`)
    } else if (payment.status === "rejected" || payment.status === "error") {
      router.replace(`${ROUTES.PAYMENT_ERROR}?payment_id=${paymentId}&status=${payment.status}`)
    }
  }, [payment, paymentId, router])

  if (!paymentId) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <p className="text-muted-foreground">No payment ID provided.</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="mx-auto h-12 w-12 rounded-full" />
          <Skeleton className="mx-auto h-6 w-48" />
          <Skeleton className="mx-auto h-4 w-64" />
          <Skeleton className="h-20 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>
    )
  }

  if (error || !payment) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <p className="text-muted-foreground">
            Unable to verify payment status. Please try again later.
          </p>
        </div>
      </div>
    )
  }

  // Show appropriate component based on current status
  // (auto-redirect handles most cases, but this covers edge cases)
  if (payment.status === "approved") {
    return <PaymentSuccess payment={payment} />
  }

  if (payment.status === "rejected" || payment.status === "error") {
    return (
      <PaymentError
        reason={payment.status === "rejected" ? "Your payment was rejected." : "An error occurred with your payment."}
        paymentId={payment.paymentId}
      />
    )
  }

  return (
    <PaymentPending
      payment={payment}
      isRefetching={isRefetching}
      onRefresh={() => refetch()}
    />
  )
}

export function PaymentPendingPageContent() {
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
      <PaymentPendingContent />
    </Suspense>
  )
}
