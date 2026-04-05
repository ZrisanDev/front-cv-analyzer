"use client";

import { Wallet } from "@mercadopago/sdk-react";
import { Skeleton } from "@/components/ui/skeleton";

interface MercadoPagoWalletProps {
  /** ID de la preferencia de pago generada por el backend */
  preferenceId: string;
  /** Si el botón está en estado de carga (antes de tener el preferenceId) */
  isLoading?: boolean;
  /** Clases CSS adicionales para el contenedor */
  className?: string;
  /** Ancho del botón (por defecto 100%) */
  width?: string | number;
}

/**
 * Componente que renderiza el botón de pago de Mercado Pago usando el Wallet Brick.
 *
 * @example
 * ```tsx
 * <MercadoPagoWallet
 *   preferenceId="1234567890-abc-def-ghi"
 *   isLoading={false}
 *   width="100%"
 * />
 * ```
 */
export function MercadoPagoWallet({
  preferenceId,
  isLoading = false,
  className = "",
  width = "100%",
}: MercadoPagoWalletProps) {
  console.log("[MercadoPagoWallet] Rendering with preferenceId:", preferenceId);

  // Mostrar skeleton mientras carga la preferencia
  if (isLoading || !preferenceId) {
    console.log(
      "[MercadoPagoWallet] Showing skeleton, isLoading:",
      isLoading,
      "preferenceId:",
      !!preferenceId,
    );
    return (
      <div className={className} style={{ width }}>
        <Skeleton className="h-11 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{ width }}
      data-testid="mercadopago-wallet-container"
    >
      <Wallet
        initialization={{
          preferenceId,
          redirectMode: "self", // "self": abre en la misma pestaña, "blank": en una nueva
        }}
        customization={{
          valueProp: "security_details",
        }}
        onReady={() => {
          console.log("[MercadoPagoWallet] Wallet Brick is ready");
        }}
        onError={(error) => {
          console.error("[MercadoPagoWallet] Wallet Brick error:", error);
        }}
      />
    </div>
  );
}
