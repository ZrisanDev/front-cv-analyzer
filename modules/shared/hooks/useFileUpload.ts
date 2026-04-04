"use client"

import { useCallback, useRef, useState } from "react"
import { MAX_FILE_SIZE, MAX_FILE_SIZE_LABEL, ACCEPTED_FILE_TYPES } from "@/modules/shared/lib/constants"

interface FileValidation {
  isValid: boolean
  error: string | null
}

interface UseFileUploadOptions {
  maxSize?: number
  acceptedTypes?: string
  onFileSelect?: (file: File) => void
  onFileRemove?: () => void
}

interface UseFileUploadReturn {
  selectedFile: File | null
  isDragging: boolean
  error: string | null
  inputRef: React.RefObject<HTMLInputElement | null>
  handleDragOver: (e: React.DragEvent) => void
  handleDragLeave: (e: React.DragEvent) => void
  handleDrop: (e: React.DragEvent) => void
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  removeFile: () => void
  openFilePicker: () => void
}

function validateFile(file: File, maxSize: number, acceptedTypes: string): FileValidation {
  // Check file type
  if (acceptedTypes && !file.name.toLowerCase().endsWith(acceptedTypes.replace(".", ""))) {
    return {
      isValid: false,
      error: `Only ${ACCEPTED_FILE_TYPES.toUpperCase().replace(".", "")} files are accepted`,
    }
  }

  // Check file size
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size must be under ${MAX_FILE_SIZE_LABEL}`,
    }
  }

  return { isValid: true, error: null }
}

export function useFileUpload(options: UseFileUploadOptions = {}): UseFileUploadReturn {
  const {
    maxSize = MAX_FILE_SIZE,
    acceptedTypes = ACCEPTED_FILE_TYPES,
    onFileSelect,
    onFileRemove,
  } = options

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const processFile = useCallback(
    (file: File) => {
      const validation = validateFile(file, maxSize, acceptedTypes)

      if (!validation.isValid) {
        setError(validation.error)
        return
      }

      setError(null)
      setSelectedFile(file)
      onFileSelect?.(file)
    },
    [maxSize, acceptedTypes, onFileSelect]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (!file) return

      processFile(file)
    },
    [processFile]
  )

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      processFile(file)
      // Reset input so the same file can be re-selected
      e.target.value = ""
    },
    [processFile]
  )

  const removeFile = useCallback(() => {
    setSelectedFile(null)
    setError(null)
    onFileRemove?.()
    // Reset input
    if (inputRef.current) {
      inputRef.current.value = ""
    }
  }, [onFileRemove])

  const openFilePicker = useCallback(() => {
    inputRef.current?.click()
  }, [])

  return {
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
  }
}
