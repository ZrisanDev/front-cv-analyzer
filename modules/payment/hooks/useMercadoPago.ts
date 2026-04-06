import { useEffect } from "react"
import { initMercadoPago } from "@mercadopago/sdk-react"

/**
 * Hook para inicializar el SDK de Mercado Pago una sola vez
 * Debe llamarse en el layout o en un componente raíz
 */
export function useMercadoPagoSDK(publicKey?: string) {
  useEffect(() => {
    if (!publicKey) {
      return
    }

    try {
      initMercadoPago(publicKey)
    } catch (error) {
      // Error silently
    }
  }, [publicKey])
}
