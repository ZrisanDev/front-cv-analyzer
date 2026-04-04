# Proposal: API Type Alignment

## Intent

Frontend TypeScript types and API functions are out of sync with the backend OpenAPI schema (17 endpoints across Auth, Analysis, Payments, History, Stats). This causes runtime errors, incorrect data mapping, and missing functionality. Primary goal: align all frontend types with backend schemas and implement missing API functions.

## Scope

### In Scope
- **Type alignment**: Fix all mismatched field names (HistoryItem, PaginatedResponse, DashboardStats, etc.)
- **Missing types**: Add all backend schemas not yet represented (AnalysisSubmitResponse, AnalysisStatusResponse, StatsSummary, ScoreEvolution, MissingKeywordStats, PaymentResponse, PreferenceResponse, TokenRefreshRequest, LogoutRequest, ForgotPasswordRequest, ResetPasswordRequest, HistoryDetailResponse, HistoryDeleteResponse, HTTPValidationError, Body_submit_analysis)
- **Missing API functions**: refreshToken, logout, forgotPassword, resetPassword, submitAnalysis, getAnalysisStatus, getHistoryDetail, getPayment, stats endpoints (summary, evolution, missing-keywords)
- **camelCase vs snake_case decision**: Establish convention and apply consistently
- **Response wrapper normalization**: Audit all endpoints for ApiResponse<T> wrapping consistency

### Out of Scope
- UI component changes (types only, components updated in separate change if needed)
- Zod validation layer (deferred — TypeScript types only for now)
- Backend changes
- New features or endpoints not in current OpenAPI spec

## Capabilities

### New Capabilities
- `api-types-history`: Correct HistoryItem, HistoryDetailResponse, PaginatedResponse types and add getHistoryDetail, deleteAnalysis APIs
- `api-types-analysis`: Add AnalysisSubmitResponse, AnalysisStatusResponse types and submitAnalysis, getAnalysisStatus APIs
- `api-types-stats`: Add StatsSummary, ScoreEvolution, MissingKeywordStats types and all stats endpoint functions
- `api-types-auth-complete`: Add TokenRefreshRequest, LogoutRequest, ForgotPasswordRequest, ResetPasswordRequest types and refreshToken, logout, forgotPassword, resetPassword APIs
- `api-types-payment`: Add PaymentResponse, PreferenceResponse types and getPayment, createPaymentPreference APIs
- `api-types-common`: Fix PaginatedResponse snake_case fields, add HTTPValidationError, establish case convention

### Modified Capabilities
- None (no existing spec-level behavior changes — this is internal type alignment)

## Approach

1. **Case convention**: Keep snake_case from backend in types (matches backend exactly, avoids transformation overhead). Convert to camelCase only at component level if needed.
2. **Create missing types** in respective module `types/` files matching backend OpenAPI schemas exactly.
3. **Fix existing types** that have wrong field names (HistoryItem is the worst offender).
4. **Add missing API functions** in respective module `api/` files.
5. **Audit response wrappers** — ensure consistent use of `ApiResponse<T>` where backend wraps, direct types where it doesn't.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `modules/shared/types/common.ts` | Modified | Fix PaginatedResponse (per_page, pages), add HTTPValidationError |
| `modules/history/types/history.ts` | Modified | Fix HistoryItem fields, add HistoryDetailResponse, HistoryDeleteResponse |
| `modules/history/api/history.ts` | Modified | Fix params (per_page), add getHistoryDetail |
| `modules/analysis/types/analysis.ts` | Modified | Add AnalysisSubmitResponse, AnalysisStatusResponse, BodySubmitAnalysis |
| `modules/analysis/api/analysis.ts` | Modified | Add submitAnalysis, getAnalysisStatus, fix initiatePayment response type |
| `modules/auth/types/auth.ts` | Modified | Add TokenRefreshRequest, LogoutRequest, ForgotPasswordRequest, ResetPasswordRequest |
| `modules/auth/api/auth.ts` | Modified | Add refreshToken, logout, forgotPassword, resetPassword |
| `modules/payment/types/payment.ts` | Modified | Add PaymentResponse, PreferenceResponse, PaymentCreate |
| `modules/payment/api/payment.ts` | Modified | Add getPayment, createPaymentPreference |
| `modules/dashboard/types/dashboard.ts` | Modified | Align with StatsSummary, ScoreEvolution, MissingKeywordStats |
| `modules/dashboard/api/dashboard.ts` | Modified | Add getStatsSummary, getScoreEvolution, getMissingKeywords |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Breaking existing components that use old field names | High | Components will show TypeScript errors — fix in follow-up change |
| Backend schema changes during implementation | Low | Pin to current OpenAPI spec, verify against running backend |
| Inconsistent ApiResponse wrapping causes runtime errors | Medium | Test each endpoint against actual backend responses |
| Scope creep into component refactoring | Medium | Strict scope boundary — types and API functions only |

## Rollback Plan

1. `git revert` the commit(s) containing type changes
2. All changes are type-level only — no runtime behavior changes that require data migration
3. If components break, they fail at compile time (TypeScript), not runtime

## Dependencies

- Backend API must be running and stable at the OpenAPI spec version used
- No frontend dependencies — pure type/API layer work

## Success Criteria

- [ ] All frontend types match backend OpenAPI schemas exactly
- [ ] All 17 backend endpoints have corresponding frontend API functions
- [ ] TypeScript compilation passes with zero errors
- [ ] No `any` types introduced as shortcuts
- [ ] PaginatedResponse uses consistent field naming throughout
