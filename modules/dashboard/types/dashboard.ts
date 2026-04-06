// Backend schemas from OpenAPI
export interface StatsSummary {
  total_analyses: number
  avg_compatibility_score: number | null
  completed: number
  failed: number
  pending: number
}

export interface ScoreEvolutionPoint {
  month: string // YYYY-MM format
  avg_score: number
  count: number
}

export interface ScoreEvolution {
  data_points: ScoreEvolutionPoint[]
}

export interface MissingKeywordItem {
  keyword: string
  missing_count: number
  percentage: number
}

export interface MissingKeywordStats {
  keywords: MissingKeywordItem[]
}

// Frontend combined types (matching component expectations)
export interface EvolutionPoint {
  date: string
  score: number
}

export interface KeywordCount {
  keyword: string
  count: number
}

export interface DashboardStats {
  totalAnalyses: number
  averageScore: number
  evolution: EvolutionPoint[]
  topMissingKeywords: KeywordCount[]
}
