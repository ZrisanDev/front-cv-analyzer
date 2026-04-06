"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ROUTES } from "@/modules/shared/lib/constants";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Componente interno que maneja la lógica de los parámetros de búsqueda.
 * Debe estar envuelto en Suspense debido a useSearchParams().
 */
function MercadoPagoCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const topic = searchParams.get("topic");
    const paymentId = searchParams.get("id");

    // Solo procesar notificaciones de pago
    if (topic !== "payment") {
      setIsProcessing(false);
      return;
    }

    if (!paymentId) {
      router.push("/");
      return;
    }

    // Redirigir a la página de pago con el ID del pago
    setTimeout(() => {
      router.push(`${ROUTES.PAYMENT_SUCCESS}?payment_id=${paymentId}`);
    }, 500);
  }, [searchParams, router]);

  if (isProcessing) {
    return <LoadingState />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="mb-4">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <svg
                className="size-6 text-green-600 dark:text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7l-4 4m0 0l6 6-6 6 6m0 0l6-6-6 6"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-center mb-2">
              ¡Pago recibido!
            </h2>
          </div>
          <p className="text-muted-foreground mb-4">
            Hemos recibido la notificación de tu pago. Redirigiendo a la página
            de confirmación...
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Si no eres redirigido automáticamente, haz clic en el botón:</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center mb-8">
          <Loader2 className="mx-auto size-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Procesando tu pago...</p>
          <p className="text-sm text-muted-foreground">
            Redirigiendo en un momento
          </p>
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  );
}

/**
 * Página de callback para MercadoPago webhooks.
 * Envuelve el contenido en Suspense para evitar errores durante el build.
 */
export default function MercadoPagoCallback() {
  return (
    <Suspense fallback={<LoadingState />}>
      <MercadoPagoCallbackContent />
    </Suspense>
  );
}
