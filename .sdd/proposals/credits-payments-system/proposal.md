# Proposal: Credits & Payments System

## Intent

Frontend lacks a credits and payments system. Users get 3 free analyses, then need to buy credit packages (20, 50, 100) via MercadoPago. Currently no credit display, no pricing page, no 402 handling, and credits fetching is missing. Primary goal: implement complete credits/purchase flow with CreditBadge, PricingPage, and payment redirect handling.

## Scope

### In Scope

- **Credits API module**: `modules/payment/api/credits.ts` (getCredits, getPackages, createPackagePreference)
- **Credits types**: `modules/payment/types/credits.ts` (UserCredits, CreditPackage, PaymentPreference, query keys)
- **Credits hook**: `modules/payment/hooks/useCredits.ts` (React Query integration)
- **CreditBadge component**: `modules/payment/components/CreditBadge.tsx` (display free + paid credits)
- **PricingCard component**: `modules/payment/components/PricingCard.tsx` (package display with purchase)
- **Pricing page**: `app/pricing/page.tsx` (public route with package grid, MercadoPago redirect)
- **402 interceptor**: Add to `modules/shared/lib/api.ts` (detect X-Needs-Payment header, redirect to /pricing)
- **Constants update**: Add PRICING route to `modules/shared/lib/constants.ts`
- **Header integration**: Add CreditBadge to `modules/shared/components/Header.tsx` (conditional on auth)
- **Payment success enhancement**: Modify `app/payment/success/page.tsx` (detect credit purchase vs analysis payment)

### Out of Scope

- Backend endpoints (already implemented)
- CreditModal (direct redirect per decision #7)
- Zod validation layer
- New payment methods beyond MercadoPago

## Capabilities

### New Capabilities

- `credits-display`: User credit balance visibility in header with free/paid breakdown
- `credits-purchase`: Package selection and MercadoPago redirect flow
- `credits-api`: API functions for fetching credits, packages, and creating payment preferences
- `payment-detection`: Distinguish credit purchases from analysis payments in callbacks
- `402-handling`: Automatic redirect to pricing when user lacks credits

### Modified Capabilities

- `payment-success` (from existing Payment module): Add credit purchase detection and credits invalidation

## Approach

1. **Credits module structure**: Follow existing pattern `/modules/payment/api/credits.ts`, not `services/credits.service.ts`
2. **402 interceptor**: Redirect directly to `/pricing` (no modal per decision #7)
3. **Pricing page**: Public route (outside `(main)` group). "Comprar" button redirects to `/login` if not authenticated (decision #3)
4. **Header integration**: CreditBadge on ALL authenticated pages only (use `useAuth().isAuthenticated`, decision #4)
5. **Payment differentiation**: Detect via query params — `?preference_id=...&status=approved` = credit purchase, `?payment_id=...` = legacy analysis (decision #5)
6. **Cache strategy**: React Query with `CREDIT_KEYS`, invalidate with `queryClient.invalidateQueries({ queryKey: CREDIT_KEYS.my() })` after purchase (decision #6)
7. **Auth pattern**: Maintain dual localStorage + cookies. Do NOT standardize to localStorage only (decision #1)
8. **Callback handling**: Reuse `/payment/success` with different params (decision #8)
9. **Refresh strategy**: Fetch on load + refetch after purchase. `staleTime: 5min`, `refetchOnWindowFocus: true`, `refetchOnReconnect: true` (decision #10)

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `modules/payment/api/credits.ts` | New | getCredits, getPackages, createPackagePreference functions |
| `modules/payment/types/credits.ts` | New | UserCredits, CreditPackage, PaymentPreference, CREDIT_KEYS |
| `modules/payment/hooks/useCredits.ts` | New | useCredits, useCreditPackages, useCreatePackagePreference hooks |
| `modules/payment/components/CreditBadge.tsx` | New | Display free_remaining + paid_credits in header |
| `modules/payment/components/PricingCard.tsx` | New | Package card with price, credits, purchase button |
| `app/pricing/page.tsx` | New | Public pricing page with grid layout, MercadoPago redirect |
| `modules/shared/lib/api.ts` | Modified | Add 402 response interceptor with X-Needs-Payment detection |
| `modules/shared/lib/constants.ts` | Modified | Add PRICING route constant |
| `modules/shared/components/Header.tsx` | Modified | Add CreditBadge component (conditional on auth) |
| `app/payment/success/page.tsx` | Modified | Detect credit purchase, invalidate credits, redirect appropriately |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| 402 interceptor conflicts with existing payment flow | Medium | Check for X-Needs-Payment header specifically before redirect |
| CreditBadge shows on public pages or payment pages | Low | Wrap in `useAuth().isAuthenticated` check per decision #4 |
| Credits cache not updating after purchase | Medium | Use `queryClient.invalidateQueries({ queryKey: CREDIT_KEYS.my() })` immediately after detecting approved status |
| MercadoPago callback confusion between credit vs analysis payments | Medium | Decision #5: detect via presence of preference_id vs payment_id query params |
| Pricing page accessible without auth | Low | Intended behavior (decision #3), purchase buttons redirect to login if unauthenticated |

## Rollback Plan

1. Revert all new files: `modules/payment/api/credits.ts`, `modules/payment/types/credits.ts`, `modules/payment/hooks/useCredits.ts`, `modules/payment/components/CreditBadge.tsx`, `modules/payment/components/PricingCard.tsx`, `app/pricing/` directory
2. Revert `modules/shared/lib/api.ts` to remove 402 interceptor
3. Revert `modules/shared/lib/constants.ts` to remove PRICING route
4. Revert `modules/shared/components/Header.tsx` to remove CreditBadge
5. Revert `app/payment/success/page.tsx` to original payment handling logic
6. All changes are frontend-only — no data migration or backend state changes

## Dependencies

- Backend API endpoints already implemented (`/api/payments/my-credits`, `/api/payments/credit-packages`, `/api/payments/create-package-preference`)
- MercadoPago integration active in backend
- React Query v5 configured in app
- Shadcn/ui components available
- Existing auth system functional (localStorage + cookies)

## Success Criteria

- [ ] CreditBadge displays correct free + paid credits in header on all authenticated pages
- [ ] CreditBadge is hidden on payment success/error pages and when not authenticated
- [ ] Pricing page accessible at `/pricing` without auth, packages displayed in grid
- [ ] Purchase button redirects to `/login` if user is not authenticated
- [ ] "Comprar" creates MercadoPago preference and redirects to payment_url
- [ ] After successful payment, credits are updated and displayed correctly
- [ ] 402 responses from backend redirect user to `/pricing` automatically
- [ ] Credits use React Query with 5min staleTime and refetch on focus/reconnect
- [ ] Payment success page correctly detects credit purchase vs analysis payment
- [ ] Cache invalidation triggers after successful credit purchase
- [ ] TypeScript compilation passes with zero errors
- [ ] All 3 pricing packages (20, 50, 100) display correctly with prices
