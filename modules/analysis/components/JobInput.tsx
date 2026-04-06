"use client"

import { useCallback } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Briefcase } from "lucide-react"

interface JobInputProps {
  jobDescription: string
  onJobDescriptionChange: (value: string) => void
  className?: string
}

export function JobInput({
  jobDescription,
  onJobDescriptionChange,
  className,
}: JobInputProps) {
  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onJobDescriptionChange(e.target.value)
    },
    [onJobDescriptionChange]
  )

  return (
    <div className={className}>
      <Label className="mb-2 flex items-center gap-2 text-sm font-medium">
        <Briefcase className="size-4" />
        Job description
      </Label>
      <div className="flex flex-col gap-2">
        <Textarea
          placeholder="Paste the job description here..."
          value={jobDescription}
          onChange={handleDescriptionChange}
          rows={6}
          className="resize-y"
        />
        <p className="text-xs text-muted-foreground">
          Paste the full job description for the most accurate analysis
        </p>
      </div>
    </div>
  )
}
