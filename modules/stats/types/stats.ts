export interface StatsSummary {
  total_analyses: number
  average_score: number
  completed_analyses: number
  failed_analyses: number
  pending_analyses: number
}

export interface ScoreEvolutionPoint {
  date: string
  score: number
}

export interface ScoreEvolution {
  points: ScoreEvolutionPoint[]
}

export interface MissingKeywordItem {
  keyword: string
  frequency: number
}

export interface MissingKeywordStats {
  keywords: MissingKeywordItem[]
}
