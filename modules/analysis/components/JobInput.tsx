"use client"

import { useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Briefcase, Link } from "lucide-react"

interface JobInputProps {
  jobDescription: string
  jobUrl: string
  activeTab: string
  onJobDescriptionChange: (value: string) => void
  onJobUrlChange: (value: string) => void
  onTabChange: (value: string) => void
  className?: string
}

export function JobInput({
  jobDescription,
  jobUrl,
  activeTab,
  onJobDescriptionChange,
  onJobUrlChange,
  onTabChange,
  className,
}: JobInputProps) {
  const handleTabChange = useCallback(
    (value: string) => {
      onTabChange(value)
    },
    [onTabChange]
  )

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onJobDescriptionChange(e.target.value)
    },
    [onJobDescriptionChange]
  )

  const handleUrlChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onJobUrlChange(e.target.value)
    },
    [onJobUrlChange]
  )

  return (
    <div className={className}>
      <Label className="mb-2 block text-sm font-medium">
        Job details
      </Label>
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="description">
            <Briefcase className="size-4" />
            Description
          </TabsTrigger>
          <TabsTrigger value="url">
            <Link className="size-4" />
            URL
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description">
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
        </TabsContent>

        <TabsContent value="url">
          <div className="flex flex-col gap-2">
            <Input
              type="url"
              placeholder="https://example.com/job-listing"
              value={jobUrl}
              onChange={handleUrlChange}
            />
            <p className="text-xs text-muted-foreground">
              Provide a direct link to the job listing
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
