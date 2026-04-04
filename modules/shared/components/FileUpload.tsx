"use client"

import { FileUp, X, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ACCEPTED_FILE_TYPES, ACCEPTED_FILE_TYPES_LABEL, MAX_FILE_SIZE_LABEL } from "@/modules/shared/lib/constants"
import { useFileUpload } from "@/modules/shared/hooks/useFileUpload"

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

interface FileUploadProps {
  onFileSelect?: (file: File) => void
  onFileRemove?: () => void
  className?: string
}

export function FileUpload({ onFileSelect, onFileRemove, className }: FileUploadProps) {
  const {
    selectedFile,
    isDragging,
    error,
    inputRef,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange,
    removeFile,
    openFilePicker,
  } = useFileUpload({
    onFileSelect,
    onFileRemove,
  })

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_FILE_TYPES}
        onChange={handleFileChange}
        className="hidden"
        aria-label="Upload CV file"
      />

      {!selectedFile ? (
        <div
          role="button"
          tabIndex={0}
          onClick={openFilePicker}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") openFilePicker()
          }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-8 text-center transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50"
          )}
        >
          <div
            className={cn(
              "flex size-12 items-center justify-center rounded-full transition-colors",
              isDragging ? "bg-primary/10" : "bg-muted"
            )}
          >
            <FileUp className={cn("size-6", isDragging ? "text-primary" : "text-muted-foreground")} />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">
              {isDragging ? "Drop your file here" : "Drag & drop your CV or click to upload"}
            </p>
            <p className="text-xs text-muted-foreground">
              {ACCEPTED_FILE_TYPES_LABEL} only, max {MAX_FILE_SIZE_LABEL}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-lg border bg-muted/50 p-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="size-5 text-primary" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <p className="truncate text-sm font-medium">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={(e) => {
              e.stopPropagation()
              removeFile()
            }}
            aria-label="Remove file"
          >
            <X className="size-4" />
          </Button>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
