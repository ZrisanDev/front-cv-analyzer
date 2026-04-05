"use client"

import { useEffect, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle, ArrowRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/modules/shared/lib/constants"
import { PaymentSuccess } from "@/modules/payment/components/PaymentSuccess"
import { usePaymentStatus } from "@/modules/payment/hooks/usePayment"
import { useQueryClient } from "@tanstack/react-query"
import { CREDIT_KEYS } from "@/modules/payment/hooks/useCredits"

function CreditPurchaseSuccess() {
  const queryClient = useQueryClient()

  useEffect(() => {
    // Invalidate credits cache to refresh display after purchase
    queryClient.invalidateQueries({ queryKey: CREDIT_KEYS.balance() })
  }, [queryClient])

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle className="size-6 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-xl">¡Compra exitosa!</CardTitle>
          <CardDescription>
            Tus créditos han sido acreditados a tu cuenta y están listos para usar.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-4">
          <Button asChild className="w-full" size="lg">
            <Link href={ROUTES.DASHBOARD}>
              Ir al dashboard
              <ArrowRight className="ml-1.5 size-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const paymentId = searchParams.get("payment_id")
  const preferenceId = searchParams.get("preference_id")
  const statusMp = searchParams.get("status")
  const externalReference = searchParams.get("external_reference")
  const collectionId = searchParams.get("collection_id")

  // Credit purchase flow: preference_id present but no payment_id
  const isCreditPurchase = !!preferenceId && !paymentId

  // ==========================================
  // SYNC CON BACKEND (datos de Mercado Pago)
  // ==========================================
  useEffect(() => {
    const syncPaymentData = async () => {
      console.log("[PaymentSuccess] Syncing payment data from URL...")

      // Enviar todos los datos de Mercado Pago al backend
      try {
        const params = new URLSearchParams()
        if (paymentId) params.append("payment_id", paymentId)
        if (preferenceId) params.append("preference_id", preferenceId)
        if (statusMp) params.append("status", statusMp)
        if (externalReference) params.append("external_reference", externalReference)
        if (collectionId) params.append("collection_id", collectionId)

        const response = await fetch("/api/payments/sync-mercadopago-redirect", {
          method: "POST",
          body: params.toString(),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })

        const result = await response.json()
        console.log("[PaymentSuccess] Sync response:", result)

        if (result.success) {
          console.log("[PaymentSuccess] Payment synced successfully ✅")
        } else {
          console.error("[PaymentSuccess] Sync failed:", result.message)
        }
      } catch (error) {
        console.error("[PaymentSuccess] Error syncing payment:", error)
      }
    }

    if (paymentId && preferenceId) {
      syncPaymentData()
    }
  }, [paymentId, preferenceId, statusMp, externalReference, collectionId])

  if (isCreditPurchase) {
    return <CreditPurchaseSuccess />
  }

  const { data: payment, isLoading, error } = usePaymentStatus(paymentId)

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

  return <PaymentSuccess payment={payment} />
}

export function PaymentSuccessPageContent() {
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
      <PaymentSuccessContent />
    </Suspense>
  )
}
