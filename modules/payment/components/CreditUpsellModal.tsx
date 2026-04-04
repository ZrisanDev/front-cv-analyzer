"use client"

import Link from "next/link"
import { Coins } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ROUTES } from "@/modules/shared/lib/constants"

interface CreditUpsellModalProps {
  /** Whether the modal is open */
  open: boolean
  /** Callback when the open state changes (controlled by shadcn Dialog) */
  onOpenChange: (open: boolean) => void
  /** Callback when user explicitly dismisses the modal */
  onDismiss: () => void
}

export function CreditUpsellModal({
  open,
  onOpenChange,
  onDismiss,
}: CreditUpsellModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="items-center text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
            <Coins className="size-6 text-amber-600 dark:text-amber-400" />
          </div>
          <DialogTitle className="text-xl">
            ¡Se te acabaron tus créditos!
          </DialogTitle>
          <DialogDescription>
            Agotaste tus análisis disponibles. Comprá un paquete de créditos para
            seguir analizando CVs y mejorando tu perfil profesional.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-col gap-2 sm:flex-col sm:gap-2">
          <Button asChild className="w-full" size="lg">
            <Link href={ROUTES.PRICING}>Ver planes</Link>
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={onDismiss}
          >
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
