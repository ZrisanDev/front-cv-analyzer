export interface Keyword {
  keyword: string
  description: string
  whyItMatters: string
  learningPath: string
  resources: string[]
}

export interface AnalysisResult {
  id: string
  score: number
  executiveSummary: string
  presentKeywords: Keyword[]
  missingKeywords: Keyword[]
  strengths: string[]
  weaknesses: string[]
  createdAt: string
}
