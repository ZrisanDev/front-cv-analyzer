"use client"

import { FileUpload } from "@/modules/shared/components/FileUpload"

interface CVUploadProps {
  onFileSelect?: (file: File) => void
  onFileRemove?: () => void
  className?: string
}

export function CVUpload({ onFileSelect, onFileRemove, className }: CVUploadProps) {
  return (
    <div className={className}>
      <label className="mb-2 block text-sm font-medium">
        Upload your CV
      </label>
      <FileUpload onFileSelect={onFileSelect} onFileRemove={onFileRemove} />
      <p className="mt-1.5 text-xs text-muted-foreground">
        We&apos;ll analyze your CV against the job description to check compatibility
      </p>
    </div>
  )
}
