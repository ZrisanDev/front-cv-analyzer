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
