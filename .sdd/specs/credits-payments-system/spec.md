# Specifications: Credits & Payments System

## Overview

Delta specs for implementing credits display, pricing page, purchase flow, and 402 handling in CV Analyzer frontend.

---

## 1. Credits Types Specification

### Requirement: Type Definitions

The system SHALL define TypeScript interfaces for credits domain.

| Interface | Fields | Purpose |
|-----------|--------|---------|
| UserCredits | free_analyses_count, free_analyses_limit, free_analyses_remaining, paid_analyses_credits, total_analyses_used | User credit state |
| CreditPackage | package_type, credits_count, price_usd, is_active | Package definition |
| PaymentPreference | preference_id, payment_url, amount, currency, package_type | MercadoPago preference |
| PaymentDetails | id, user_id, amount, currency, status, package_type, created_at, updated_at | Payment record |
| CREDIT_KEYS | my(), packages() | React Query key factory |

#### Scenario: Type Export

- GIVEN the credits types module
- WHEN imported by other modules
- THEN all interfaces and CREDIT_KEYS constant MUST be accessible

---

## 2. Credits API Specification

### Requirement: API Functions

The system SHALL provide API functions in `modules/payment/api/credits.ts`.

| Function | Method | Endpoint | Auth |
|----------|--------|----------|------|
| getMyCredits | GET | /api/payments/my-credits | Required |
| getCreditPackages | GET | /api/payments/credit-packages | Required |
| createPackagePreference | POST | /api/payments/create-package-preference | Required |
| getPaymentDetails | GET | /api/payments/{payment_id} | Required |

#### Scenario: Fetch User Credits

- GIVEN authenticated user
- WHEN getMyCredits is called
- THEN return UserCredits object with free_analyses_remaining and paid_analyses_credits

#### Scenario: Unauthenticated Request

- GIVEN no auth token
- WHEN any credits API function is called
- THEN request fails with 401 and user is redirected to /login

#### Scenario: Server Error

- GIVEN backend returns 500
- WHEN API function is called
- THEN error is propagated to caller for UI handling

---

## 3. Credits Hooks Specification

### Requirement: React Query Hooks

The system SHALL provide hooks in `modules/payment/hooks/useCredits.ts`.

| Hook | Query Key | Config |
|------|-----------|--------|
| useMyCredits | CREDIT_KEYS.my() | staleTime: 5min, refetchOnWindowFocus: true, refetchOnReconnect: true |
| useCreditPackages | CREDIT_KEYS.packages() | staleTime: 5min |
| useCreatePackagePreference | mutation | invalidates CREDIT_KEYS.my() on success |

#### Scenario: Credits Data Loading

- GIVEN component mounts with useMyCredits
- WHEN data is loading
- THEN isLoading is true, data is undefined

#### Scenario: Credits Refetch on Focus

- GIVEN stale credits data (>5min old)
- WHEN window regains focus
- THEN credits are automatically refetched

#### Scenario: Cache Invalidation After Purchase

- GIVEN successful payment detected
- WHEN credits are invalidated
- THEN useMyCredits refetches fresh data

---

## 4. CreditBadge Component Specification

### Requirement: Credit Display

The system SHALL display user credits in `modules/payment/components/CreditBadge.tsx`.

#### Scenario: Display Total Credits

- GIVEN user has 0 free remaining, 50 paid credits
- WHEN CreditBadge renders
- THEN display "50 análisis disponibles" with breakdown "(0 gratis + 50 pagos)"

#### Scenario: Mixed Credits

- GIVEN user has 2 free remaining, 10 paid credits
- WHEN CreditBadge renders
- THEN display "12 análisis disponibles" with breakdown "(2 gratis + 10 pagos)"

#### Scenario: Zero Credits

- GIVEN user has 0 free remaining, 0 paid credits
- WHEN CreditBadge renders
- THEN display "0 análisis disponibles" with breakdown "(0 gratis + 0 pagos)"

#### Scenario: Loading State

- GIVEN credits are loading
- WHEN CreditBadge renders
- THEN display skeleton loader

---

## 5. Header Integration Specification

### Requirement: Conditional Badge Display

The system SHALL modify `modules/shared/components/Header.tsx` to include CreditBadge.

#### Scenario: Authenticated User

- GIVEN user is authenticated (useAuth().isAuthenticated = true)
- WHEN Header renders on any page except payment success/error/pending
- THEN CreditBadge is visible

#### Scenario: Unauthenticated User

- GIVEN user is not authenticated
- WHEN Header renders
- THEN CreditBadge is NOT rendered

---

## 6. PricingCard Component Specification

### Requirement: Package Display

The system SHALL display packages in `modules/payment/components/PricingCard.tsx`.

#### Scenario: Standard Package

- GIVEN package_type="pack_20", credits_count=20, price_usd=3.0
- WHEN PricingCard renders
- THEN display "Pack 20", "$3.00 USD", "$0.15 por análisis"

#### Scenario: Popular Package Highlight

- GIVEN is_popular=true (pack_50)
- WHEN PricingCard renders
- THEN display "MÁS POPULAR" badge with enhanced styling

#### Scenario: Purchase Button Click

- GIVEN user clicks "Comprar Ahora"
- WHEN onSelect callback fires
- THEN pass package_type to parent handler

---

## 7. Pricing Page Specification

### Requirement: Public Pricing Route

The system SHALL create `/app/pricing/page.tsx` as public route.

#### Scenario: Load Packages

- GIVEN user navigates to /pricing
- WHEN page loads
- THEN fetch and display 3 pricing cards (pack_20, pack_50, pack_100)

#### Scenario: Unauthenticated Purchase

- GIVEN user is NOT authenticated
- WHEN clicking "Comprar" button
- THEN redirect to /login?returnUrl=/pricing

#### Scenario: Authenticated Purchase

- GIVEN user is authenticated
- WHEN clicking "Comprar" on pack_50
- THEN call createPackagePreference("pack_50"), redirect to payment_url

#### Scenario: MercadoPago Redirect Failure

- GIVEN createPackagePreference fails
- WHEN error occurs
- THEN display error toast "Error al iniciar el pago. Por favor intenta nuevamente."

---

## 8. Payment Detection Specification

### Requirement: Distinguish Payment Types

The system SHALL modify `/app/payment/success/` to detect credit vs analysis payments.

| Query Param | Payment Type | Action |
|-------------|--------------|--------|
| preference_id + status=approved | Credit purchase | invalidate CREDIT_KEYS.my(), redirect to /analyze |
| payment_id | Analysis payment | existing flow (fetch status, show result) |

#### Scenario: Credit Purchase Success

- GIVEN URL has ?preference_id=123&status=approved
- WHEN page loads
- THEN invalidate credits cache, show success message, redirect to /analyze

#### Scenario: Credit Purchase Pending

- GIVEN URL has ?preference_id=123&status=pending
- WHEN page loads
- THEN show pending message with instructions

#### Scenario: Credit Purchase Failure

- GIVEN URL has ?preference_id=123&status=failure
- WHEN page loads
- THEN show error message with retry button linking to /pricing

#### Scenario: Legacy Analysis Payment

- GIVEN URL has ?payment_id=456
- WHEN page loads
- THEN execute existing usePaymentStatus flow

---

## 9. 402 Interceptor Specification

### Requirement: Auto-redirect on Insufficient Credits

The system SHALL modify `modules/shared/lib/api.ts` to intercept 402 responses.

#### Scenario: 402 with X-Needs-Payment Header

- GIVEN API response has status=402 AND header X-Needs-Payment=true
- WHEN interceptor processes response
- THEN redirect to /pricing immediately (no modal)

#### Scenario: 402 without Header

- GIVEN API response has status=402 but NO X-Needs-Payment header
- WHEN interceptor processes response
- THEN propagate error normally (no redirect)

#### Scenario: Applied to All Endpoints

- GIVEN any API call returns 402 with X-Needs-Payment
- WHEN error interceptor fires
- THEN redirect to /pricing regardless of endpoint

---

## 10. Constants Update Specification

### Requirement: Add PRICING Route

The system SHALL add PRICING route to `modules/shared/lib/constants.ts`.

#### Scenario: Route Access

- GIVEN ROUTES constant imported
- WHEN accessing ROUTES.PRICING
- THEN return "/pricing"

---

## Dependencies

| Capability | Depends On |
|------------|------------|
| useMyCredits | credits API, CREDIT_KEYS |
| CreditBadge | useMyCredits, Shadcn Badge |
| Header integration | CreditBadge, useAuth |
| PricingCard | Shadcn Card, Button |
| Pricing page | useCreditPackages, PricingCard, useAuth |
| Payment detection | CREDIT_KEYS, queryClient |
| 402 interceptor | existing api.ts |

---

## Out of Scope

- Backend implementation (already done)
- CreditModal component (decision #7: direct redirect)
- Zod validation layer
- Payment methods beyond MercadoPago
- MercadoPago SDK integration (using redirect flow)
