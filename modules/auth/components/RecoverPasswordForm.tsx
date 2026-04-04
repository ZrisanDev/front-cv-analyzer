"use client"

import { useFormik } from "formik"
import * as Yup from "yup"
import { useRouter } from "next/navigation"
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from "lucide-react"
import { toast } from "react-hot-toast"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { recoverPassword } from "@/modules/auth/api/auth"
import { ROUTES } from "@/modules/shared/lib/constants"
import Link from "next/link"
import { cn } from "@/lib/utils"

const recoverSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
})

interface RecoverFormValues {
  email: string
}

interface RecoverPasswordFormProps {
  className?: string
}

export function RecoverPasswordForm({ className }: RecoverPasswordFormProps) {
  const router = useRouter()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const formik = useFormik<RecoverFormValues>({
    initialValues: { email: "" },
    validationSchema: recoverSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setIsLoading(true)
      try {
        await recoverPassword({ email: values.email })
        setIsSubmitted(true)
        toast.success("Recovery email sent! Check your inbox.")
      } catch {
        // Show generic success for security (per spec REQ-1.3)
        setIsSubmitted(true)
        toast.success("If the email exists, you will receive a recovery link.")
      } finally {
        setIsLoading(false)
        setSubmitting(false)
      }
    },
  })

  if (isSubmitted) {
    return (
      <Card className={cn("text-center", className)}>
        <CardHeader>
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="size-6 text-primary" />
          </div>
          <CardTitle className="text-xl">Check your email</CardTitle>
          <CardDescription>
            We sent a password recovery link to your email address.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <Button variant="outline" asChild>
            <Link href={ROUTES.LOGIN}>
              <ArrowLeft className="size-4" />
              Back to sign in
            </Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Forgot your password?</CardTitle>
        <CardDescription>
          Enter your email and we&apos;ll send you a recovery link
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          {/* Email field */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="recover-email">Email</Label>
            <Input
              id="recover-email"
              name="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              disabled={isLoading}
              aria-invalid={formik.touched.email && !!formik.errors.email}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-sm text-destructive">{formik.errors.email}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading || formik.isSubmitting}
            className="mt-2 w-full"
          >
            {isLoading || formik.isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="size-4" />
                Send recovery link
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link href={ROUTES.LOGIN} className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
