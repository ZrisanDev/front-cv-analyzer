"use client"

import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CreditCard } from "lucide-react"
import { CVUpload } from "@/modules/analysis/components/CVUpload"
import { JobInput } from "@/modules/analysis/components/JobInput"
import { PriceDisplay } from "@/modules/analysis/components/PriceDisplay"
import { usePayment } from "@/modules/analysis/hooks/useAnalysis"

export function AnalysisForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState("")
  const [jobUrl, setJobUrl] = useState("")
  const [activeTab, setActiveTab] = useState("description")
  const [validationError, setValidationError] = useState<string | null>(null)

  const payment = usePayment()

  const isFormValid = selectedFile && (jobDescription.trim() || jobUrl.trim())
  const isJobInputFilled = activeTab === "description" ? jobDescription.trim() : jobUrl.trim()

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file)
    setValidationError(null)
  }, [])

  const handleFileRemove = useCallback(() => {
    setSelectedFile(null)
  }, [])

  const handlePay = useCallback(async () => {
    if (!selectedFile) {
      setValidationError("Please upload your CV")
      return
    }

    if (!isJobInputFilled) {
      setValidationError(
        activeTab === "description"
          ? "Please enter the job description"
          : "Please enter the job URL"
      )
      return
    }

    setValidationError(null)

    payment.mutate({
      cv: selectedFile,
      jobDescription: activeTab === "description" ? jobDescription : undefined,
      jobUrl: activeTab === "url" ? jobUrl : undefined,
    })
  }, [selectedFile, isJobInputFilled, activeTab, jobDescription, jobUrl, payment])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">New Analysis</CardTitle>
        <CardDescription>
          Upload your CV and provide the job details to get a compatibility analysis
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <CVUpload
          onFileSelect={handleFileSelect}
          onFileRemove={handleFileRemove}
        />

        <JobInput
          jobDescription={jobDescription}
          jobUrl={jobUrl}
          activeTab={activeTab}
          onJobDescriptionChange={setJobDescription}
          onJobUrlChange={setJobUrl}
          onTabChange={setActiveTab}
        />

        {validationError && (
          <Alert variant="destructive">
            <AlertDescription>{validationError}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <PriceDisplay />

          <Button
            onClick={handlePay}
            disabled={!isFormValid || payment.isPending}
            size="lg"
          >
            {payment.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="size-4" />
                Pay and Analyze
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
