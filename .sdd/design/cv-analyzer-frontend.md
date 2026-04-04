# Technical Design: CV Analyzer Frontend

## Architecture Overview

Module-based architecture with Next.js 16 App Router. Each feature module is self-contained with its own components, hooks, types, and API layer. Shared utilities live in a `shared` module.

```
front-analyzer-cv/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── recover/page.tsx
│   ├── (main)/
│   │   ├── layout.tsx              # Protected layout with sidebar
│   │   ├── analyze/page.tsx
│   │   ├── results/page.tsx
│   │   ├── history/page.tsx
│   │   └── dashboard/page.tsx
│   ├── payment/
│   │   ├── success/page.tsx
│   │   ├── error/page.tsx
│   │   └── pending/page.tsx
│   ├── layout.tsx                  # Root: providers
│   └── page.tsx                    # Redirect to /login or /analyze
├── modules/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── RecoverPasswordForm.tsx
│   │   │   └── AuthLayout.tsx
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useSession.ts
│   │   ├── types/
│   │   │   └── auth.ts
│   │   ├── api/
│   │   │   └── auth.ts
│   │   └── index.ts
│   ├── analysis/
│   │   ├── components/
│   │   │   ├── CVUpload.tsx
│   │   │   ├── JobInput.tsx
│   │   │   ├── PriceDisplay.tsx
│   │   │   └── AnalysisForm.tsx
│   │   ├── hooks/
│   │   │   └── useAnalysis.ts
│   │   ├── types/
│   │   │   └── analysis.ts
│   │   ├── api/
│   │   │   └── analysis.ts
│   │   └── index.ts
│   ├── payment/
│   │   ├── components/
│   │   │   ├── PaymentSuccess.tsx
│   │   │   ├── PaymentError.tsx
│   │   │   └── PaymentPending.tsx
│   │   ├── hooks/
│   │   │   └── usePayment.ts
│   │   ├── types/
│   │   │   └── payment.ts
│   │   ├── api/
│   │   │   └── payment.ts
│   │   └── index.ts
│   ├── results/
│   │   ├── components/
│   │   │   ├── CompatibilityScore.tsx
│   │   │   ├── KeywordsList.tsx
│   │   │   ├── KeywordDetail.tsx
│   │   │   ├── StrengthsWeaknesses.tsx
│   │   │   └── ExecutiveSummary.tsx
│   │   ├── hooks/
│   │   │   └── useResults.ts
│   │   ├── types/
│   │   │   └── results.ts
│   │   ├── api/
│   │   │   └── results.ts
│   │   └── index.ts
│   ├── history/
│   │   ├── components/
│   │   │   ├── HistoryList.tsx
│   │   │   ├── HistoryItem.tsx
│   │   │   └── DeleteConfirmDialog.tsx
│   │   ├── hooks/
│   │   │   └── useHistory.ts
│   │   ├── types/
│   │   │   └── history.ts
│   │   ├── api/
│   │   │   └── history.ts
│   │   └── index.ts
│   ├── dashboard/
│   │   ├── components/
│   │   │   ├── StatsCards.tsx
│   │   │   ├── ScoreEvolutionChart.tsx
│   │   │   └── TopMissingKeywordsChart.tsx
│   │   ├── hooks/
│   │   │   └── useDashboard.ts
│   │   ├── types/
│   │   │   └── dashboard.ts
│   │   ├── api/
│   │   │   └── dashboard.ts
│   │   └── index.ts
│   └── shared/
│       ├── components/
│       │   ├── Header.tsx
│       │   ├── Sidebar.tsx
│       │   ├── FileUpload.tsx
│       │   ├── LoadingSkeleton.tsx
│       │   └── EmptyState.tsx
│       ├── hooks/
│       │   ├── useApi.ts
│       │   └── useFileUpload.ts
│       ├── types/
│       │   └── common.ts
│       ├── lib/
│       │   ├── api.ts
│       │   ├── constants.ts
│       │   └── utils.ts
│       └── index.ts
├── middleware.ts
├── lib/
│   └── utils.ts                    # cn() utility (shadcn)
└── components/ui/                  # shadcn components (managed by CLI)
```

## Data Flow

```
User Action → Component → Hook (useXxx) → API Function → Axios → Backend
                                              ↓
                                        React Query (cache)
                                              ↓
                                        Component re-render
```

- **Components** are presentational, receive data via props from hooks
- **Hooks** orchestrate data fetching (React Query), form state (Formik), and business logic
- **API functions** are thin wrappers around axios calls
- **React Query** handles caching, loading states, error states, and refetching

## Auth Flow

### Token Management
- Token stored in `localStorage` (key: `cv_analyzer_token`)
- Auth context (`useAuth`) provides: `user`, `token`, `login()`, `logout()`, `isAuthenticated`, `isLoading`
- On app load: check localStorage for token → validate with `/api/auth/me` → set user or clear token

### Middleware (`middleware.ts`)
```typescript
// Protected routes: /(main)/*
// If no token → redirect to /login?from=/current-path
// Public routes: /(auth)/*, /payment/*, /
// If has token and accessing /(auth)/* → redirect to /analyze
```

### Session Expiration
- Axios response interceptor catches 401 → clears token → redirects to /login
- No refresh token flow (simpler approach for MVP)

## API Layer

### Axios Setup (`modules/shared/lib/api.ts`)
```typescript
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000',
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cv_analyzer_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('cv_analyzer_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### React Query Integration
- QueryClient configured in root layout with default staleTime of 5 minutes
- Each module's hooks use `useQuery`, `useMutation` from react-query
- Mutations invalidate relevant queries on success

## Component Patterns

### Presentational Components
- Receive all data via props
- No direct API calls
- Use shadcn components for UI primitives
- Tailwind for styling

### Container Pattern (via hooks)
- Hooks handle all data fetching and business logic
- Components call hooks and pass data to presentational children

### File Upload (Manual, No react-dropzone)
```typescript
// modules/shared/components/FileUpload.tsx
// - Drag & drop via native HTML5 drag events (onDragOver, onDrop)
// - Click to upload via hidden <input type="file" accept=".pdf" />
// - Visual feedback: highlight on drag over, file name display, remove button
// - Validation: PDF only, max 10MB
```

## State Management

| State Type | Solution | Examples |
|------------|----------|----------|
| Server state | React Query | Analyses list, results, history, dashboard stats |
| Form state | Formik + Yup | Login, register, job input |
| UI state | Local state (useState) | Modal open/close, active tab, file preview |
| Auth state | Custom hook + localStorage | Token, user info, isAuthenticated |
| Global UI state | None needed | Keep it simple, lift state when needed |

## Routing Strategy

### Route Groups
- `(auth)` - Public auth routes, no sidebar layout
- `(main)` - Protected routes, shared sidebar layout
- `payment/` - Payment callback routes (not protected, accessed via redirect)

### Navigation
- Sidebar component in `(main)/layout.tsx` with links: Analyze, History, Dashboard
- Active link highlighting via `usePathname()`
- Mobile: hamburger menu or bottom navigation

## Error Handling

### Global
- Error boundary in root layout for unexpected errors
- 500 error page at `app/error.tsx`
- Not found page at `app/not-found.tsx`

### API Errors
- Toast notifications via react-hot-toast for all API errors
- Specific error messages from backend when available
- Generic fallback: "An unexpected error occurred. Please try again."

### Form Errors
- Yup validation messages displayed inline below fields
- Formik `touched` + `errors` pattern for showing validation

## Loading States

- **Skeleton loaders** for all data-fetching components (shadcn Skeleton)
- **Button loading state** during form submissions (disabled + spinner)
- **Progress indicator** during file upload
- **Page-level loading** for initial auth check

## Responsive Design

- **Mobile first** approach with Tailwind breakpoints
- **Sidebar**: collapsible on mobile, fixed on desktop
- **Tables**: horizontal scroll on mobile, full width on desktop
- **Charts**: responsive containers with Recharts ResponsiveContainer
- **Forms**: stacked on mobile, side-by-side where appropriate on desktop

## Charts Implementation

- **Score Evolution**: Line chart with Recharts (XAxis: date, YAxis: score, Line: score values)
- **Top Missing Keywords**: Bar chart with Recharts (XAxis: keyword, YAxis: count, Bar: frequency)
- Use shadcn's Chart component as wrapper
- Format dates with JS Temporal API

## Date Handling (JS Temporal API)

```typescript
// Use Temporal.Now.plainDateISO() for current date
// Use Temporal.PlainDate.from() for parsing dates from API
// Use Temporal.Duration for calculating differences
// Format with .toLocaleString('es-AR') or similar
```

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Shadcn Components to Install

```bash
bunx shadcn@latest add select textarea badge skeleton dropdown-menu avatar tooltip chart
```

## Implementation Order

1. **Foundation**: API client, auth module, middleware, providers
2. **Core**: Analysis module (main screen with CV upload + job input)
3. **Payment**: Payment module with MercadoPago redirect
4. **Results**: Results display module
5. **History**: History module with list, detail, delete
6. **Dashboard**: Dashboard with charts and statistics
7. **Polish**: Loading states, error handling, responsive design, edge cases
