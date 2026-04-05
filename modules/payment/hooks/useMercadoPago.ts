import { useEffect } from "react"
import { initMercadoPago } from "@mercadopago/sdk-react"

/**
 * Hook para inicializar el SDK de Mercado Pago una sola vez
 * Debe llamarse en el layout o en un componente raíz
 */
export function useMercadoPagoSDK(publicKey?: string) {
  useEffect(() => {
    if (!publicKey) {
      console.warn(
        "[useMercadoPagoSDK] No public key provided. Skipping initialization."
      )
      return
    }

    try {
      initMercadoPago(publicKey)
      console.log("[useMercadoPagoSDK] Mercado Pago SDK initialized successfully")
    } catch (error) {
      console.error("[useMercadoPagoSDK] Error initializing Mercado Pago SDK:", error)
    }
  }, [publicKey])
}
