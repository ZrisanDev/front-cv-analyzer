"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

interface PaymentData {
  status: string;
  paymentId: string | null;
  collectionId: string | null;
  externalReference: string | null;
  paymentType: string | null;
  merchantOrderId: string | null;
}

function extractPaymentData(searchParams: URLSearchParams): PaymentData {
  return {
    status: searchParams.get("status") || "unknown",
    paymentId: searchParams.get("payment_id"),
    collectionId: searchParams.get("collection_id"),
    externalReference: searchParams.get("external_reference"),
    paymentType: searchParams.get("payment_type"),
    merchantOrderId: searchParams.get("merchant_order_id"),
  };
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const paymentData = extractPaymentData(searchParams);

  // Determinar el estado del pago
  const isApproved = paymentData.status === "approved";
  const isPending = paymentData.status === "pending";
  const isFailed =
    paymentData.status === "rejected" ||
    paymentData.status === "cancelled";

  // Mapear tipos de pago a texto amigable
  const paymentTypeMap: Record<string, string> = {
    account_money: "Dinero en cuenta",
    credit_card: "Tarjeta de crédito",
    debit_card: "Tarjeta de débito",
    ticket: "Pago en efectivo",
    atm: "Cajero automático",
    wallet_purchase: "Billetera Mercado Pago",
  };

  const paymentTypeText =
    paymentTypeMap[paymentData.paymentType || ""] ||
    paymentData.paymentType;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {/* Ícono y mensaje principal */}
        <div className="text-center mb-6">
          {isApproved && (
            <>
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                ¡Pago completado!
              </h1>
              <p className="text-gray-600">
                Tu pago ha sido procesado exitosamente.
              </p>
            </>
          )}

          {isPending && (
            <>
              <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Pago pendiente
              </h1>
              <p className="text-gray-600">
                Tu pago está siendo procesado.
              </p>
            </>
          )}

          {isFailed && (
            <>
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Pago rechazado
              </h1>
              <p className="text-gray-600">
                Hubo un problema con tu pago.
              </p>
            </>
          )}
        </div>

        {/* Detalles del pago */}
        <div className="space-y-4 mb-6">
          {/* ID de la transacción */}
          {(paymentData.paymentId || paymentData.collectionId) && (
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">
                ID de transacción
              </span>
              <span className="text-sm font-medium text-gray-900 font-mono">
                {paymentData.paymentId || paymentData.collectionId || "-"}
              </span>
            </div>
          )}

          {/* Tipo de pago */}
          {paymentData.paymentType && (
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">Método de pago</span>
              <span className="text-sm font-medium text-gray-900">
                {paymentTypeText}
              </span>
            </div>
          )}

          {/* Referencia del pedido */}
          {paymentData.externalReference && (
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">
                Referencia del pedido
              </span>
              <span className="text-sm font-medium text-gray-900 font-mono">
                {paymentData.externalReference}
              </span>
            </div>
          )}

          {/* Orden de comerciante */}
          {paymentData.merchantOrderId && (
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-sm text-gray-600">ID de orden</span>
              <span className="text-sm font-medium text-gray-900 font-mono">
                {paymentData.merchantOrderId}
              </span>
            </div>
          )}
        </div>

        {/* AVISO IMPORTANTE - Estos datos NO son confiables */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Te enviaremos un correo de confirmación cuando el pago se
                complete. Si tienes dudas, contáctanos.
              </p>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="space-y-3">
          <button
            onClick={() => (window.location.href = "/")}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Volver al inicio
          </button>

          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="w-full bg-white text-gray-700 py-3 px-4 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Ir al dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export function PaymentSuccessPageContent() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="w-full max-w-md space-y-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-gray-200 animate-pulse" />
            <div className="mx-auto h-6 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="mx-auto h-4 w-64 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
