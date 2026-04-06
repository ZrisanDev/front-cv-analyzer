import { api } from "@/modules/shared/lib/api"
import type { AnalysisResult, AnalysisContent, Keyword } from "@/modules/results/types/results"

// Backend response type (what the API actually returns)
interface BackendAnalysisResult {
  id: string
  status: string
  compatibility_score: number | null
  analysis_result: BackendAnalysisContent | null
  error_message: string | null
  created_at: string
  updated_at: string
}

interface BackendAnalysisContent {
  strengths: string[]
  weaknesses: string[]
  missing_keywords: string[]
  present_keywords: string[]
  learning_paths: {
    keyword: string
    how: string
    why: string
    what: string
    resources: string[]
  }[]
  executive_summary: string
  compatibility_score: number
}

// Transform backend response to frontend format
function transformBackendToFrontend(backend: BackendAnalysisResult): AnalysisResult {
  const analysisContent = backend.analysis_result

  if (!analysisContent) {
    return backend as unknown as AnalysisResult
  }

  // Transform learning_paths into Keyword objects
  const transformLearningPathToKeyword = (lp: BackendAnalysisContent["learning_paths"][0]): Keyword => ({
    keyword: lp.keyword,
    description: lp.what,
    whyItMatters: lp.why,
    learningPath: lp.how,
    resources: lp.resources,
  })

  // Map learning_paths to keywords
  const keywordsFromLearningPaths: Keyword[] = analysisContent.learning_paths.map(transformLearningPathToKeyword)

  // Separate into present and missing based on present_keywords and missing_keywords arrays
  const keywords_present: Keyword[] = analysisContent.present_keywords
    .map(keywordString => keywordsFromLearningPaths.find(kw => kw.keyword === keywordString))
    .filter((kw): kw is Keyword => kw !== undefined)

  const keywords_missing: Keyword[] = analysisContent.missing_keywords
    .map(keywordString => keywordsFromLearningPaths.find(kw => kw.keyword === keywordString))
    .filter((kw): kw is Keyword => kw !== undefined)

  // Build the transformed AnalysisContent
  const transformedAnalysisContent: AnalysisContent = {
    summary: analysisContent.executive_summary,
    strengths: analysisContent.strengths,
    weaknesses: analysisContent.weaknesses,
    compatibility: analysisContent.compatibility_score,
    keywords_missing,
    keywords_present,
    learning_paths: keywordsFromLearningPaths, // Include all learning paths
  }

  return {
    id: backend.id,
    status: backend.status,
    compatibility_score: backend.compatibility_score,
    analysis_result: transformedAnalysisContent,
    error_message: backend.error_message,
    created_at: backend.created_at,
    updated_at: backend.updated_at,
  }
}

export async function getAnalysisResult(analysisId: string): Promise<AnalysisResult> {
  const { data } = await api.get<BackendAnalysisResult>(
    `/api/analysis/${analysisId}/status`
  )
  return transformBackendToFrontend(data)
}
