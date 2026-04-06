export interface Keyword {
  keyword: string
  description: string
  whyItMatters: string
  learningPath: string
  resources: string[]
}

export interface AnalysisContent {
  summary: string
  strengths: string[]
  weaknesses: string[]
  compatibility: number
  keywords_missing: Keyword[]
  keywords_present: Keyword[]
  learning_paths: Keyword[]
}

export interface AnalysisResult {
  id: string
  status: string
  compatibility_score: number | null
  analysis_result: AnalysisContent | null
  error_message: string | null
  created_at: string
  updated_at: string
}
