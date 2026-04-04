# Spec: CV Analyzer Frontend

## Overview

**Intent**: Build a complete CV Analyzer frontend that allows users to upload their CV, submit a job description or URL, pay via MercadoPago, and receive detailed compatibility analysis results.

**Scope**: 6 feature modules (auth, analysis, payment, results, history, dashboard) with module-based architecture.

**Out of Scope**: Backend API implementation, MercadoPago webhook server setup, PDF parsing logic.

---

## Module 1: Auth

### REQ-1.1: User Registration
**As a** new user, **I want to** register with name, email, and password **so that** I can access the application.

**Scenarios**:
- GIVEN valid name, email, and password WHEN submitting the form THEN account is created and user is redirected to login
- GIVEN an email that already exists WHEN submitting THEN show error "Email already registered"
- GIVEN invalid email format WHEN typing THEN show validation error immediately
- GIVEN password shorter than 8 characters WHEN submitting THEN show validation error

### REQ-1.2: User Login
**As a** registered user, **I want to** login with email and password **so that** I can access my analyses.

**Scenarios**:
- GIVEN valid credentials WHEN submitting THEN token is stored and user is redirected to /analyze
- GIVEN invalid credentials WHEN submitting THEN show error "Invalid email or password"
- GIVEN unauthenticated user accessing protected route THEN redirect to /login

### REQ-1.3: Password Recovery
**As a** user who forgot their password, **I want to** request a password reset **so that** I can regain access.

**Scenarios**:
- GIVEN valid email WHEN submitting recovery form THEN show confirmation message
- GIVEN non-existent email WHEN submitting THEN show generic success (security best practice)

### REQ-1.4: Session Management
**As a** logged-in user, **I want to** maintain my session **so that** I don't need to re-login on every visit.

**Scenarios**:
- GIVEN valid token in storage WHEN loading app THEN user is auto-authenticated
- GIVEN expired token WHEN making API call THEN redirect to login
- GIVEN user clicks logout THEN token is cleared and user is redirected to login

---

## Module 2: Analysis (Main Screen)

### REQ-2.1: CV Upload
**As a** user, **I want to** upload my CV in PDF format **so that** it can be analyzed.

**Scenarios**:
- GIVEN user drags a PDF file over the upload area THEN highlight the drop zone
- GIVEN user drops a valid PDF file THEN show file name and size with option to remove
- GIVEN user clicks the upload area THEN open file picker
- GIVEN user selects a non-PDF file THEN show error "Only PDF files are accepted"
- GIVEN file size exceeds 10MB THEN show error "File size must be under 10MB"

### REQ-2.2: Job Input
**As a** user, **I want to** provide the job description via text or URL **so that** my CV can be matched against it.

**Scenarios**:
- GIVEN user selects "text" tab THEN show textarea for job description
- GIVEN user selects "URL" tab THEN show URL input field
- GIVEN user pastes a valid URL WHEN validating THEN show loading indicator while fetching
- GIVEN empty job input WHEN attempting to proceed THEN show validation error

### REQ-2.3: Price Display & Payment Initiation
**As a** user, **I want to** see the price before paying **so that** I can make an informed decision.

**Scenarios**:
- GIVEN valid CV and job input WHEN ready THEN display price clearly
- GIVEN user clicks "Pay and Analyze" THEN redirect to MercadoPago checkout
- GIVEN missing CV or job input WHEN clicking pay THEN show validation errors

---

## Module 3: Payment

### REQ-3.1: MercadoPago Redirect
**As a** user, **I want to** be redirected to MercadoPago checkout **so that** I can complete payment securely.

**Scenarios**:
- GIVEN user initiates payment WHEN redirect succeeds THEN user is on MercadoPago page
- GIVEN payment redirect fails THEN show error with retry option

### REQ-3.2: Payment Success
**As a** user who paid successfully, **I want to** see a confirmation screen **so that** I know my payment was processed.

**Scenarios**:
- GIVEN payment approved WHEN redirected back THEN show success screen with analysis status
- GIVEN analysis is processing THEN show progress indicator

### REQ-3.3: Payment Error
**As a** user whose payment failed, **I want to** see an error screen **so that** I can retry.

**Scenarios**:
- GIVEN payment rejected WHEN redirected back THEN show error screen with reason and retry button
- GIVEN payment pending WHEN redirected back THEN show pending screen with instructions

---

## Module 4: Results

### REQ-4.1: Compatibility Score Display
**As a** user, **I want to** see my compatibility score visually **so that** I can quickly understand my match level.

**Scenarios**:
- GIVEN analysis results WHEN loading page THEN show circular progress indicator or progress bar with score percentage
- GIVEN score >= 70% THEN use green color scheme
- GIVEN score 40-69% THEN use yellow/orange color scheme
- GIVEN score < 40% THEN use red color scheme

### REQ-4.2: Keywords Analysis
**As a** user, **I want to** see which keywords I have and which I'm missing **so that** I know my gaps.

**Scenarios**:
- GIVEN results loaded THEN show present keywords in green badges
- GIVEN results loaded THEN show missing keywords in red badges
- GIVEN a missing keyword WHEN expanding it THEN show: what it is, why it matters, what to learn, suggested resources

### REQ-4.3: Strengths & Weaknesses
**As a** user, **I want to** see my strengths and weaknesses **so that** I can focus my improvement efforts.

**Scenarios**:
- GIVEN results loaded THEN show strengths section with positive points
- GIVEN results loaded THEN show weaknesses section with improvement suggestions

### REQ-4.4: Executive Summary
**As a** user, **I want to** see a highlighted executive summary **so that** I get a quick overview.

**Scenarios**:
- GIVEN results loaded THEN show executive summary in a prominent card/section at the top

---

## Module 5: History

### REQ-5.1: Analysis List
**As a** user, **I want to** see my past analyses **so that** I can track my progress over time.

**Scenarios**:
- GIVEN user has analyses WHEN viewing history THEN show table with date, job title, and score
- GIVEN user has no analyses WHEN viewing history THEN show empty state message
- GIVEN more than 10 analyses THEN show pagination or infinite scroll

### REQ-5.2: Analysis Detail
**As a** user, **I want to** view details of any past analysis **so that** I can review the full results.

**Scenarios**:
- GIVEN user clicks on an analysis WHEN loading THEN show full results view (same as REQ-4)

### REQ-5.3: Delete Analysis
**As a** user, **I want to** delete an analysis **so that** I can manage my history.

**Scenarios**:
- GIVEN user clicks delete on an analysis WHEN confirming THEN remove from list and show success toast
- GIVEN user cancels deletion THEN keep the analysis

---

## Module 6: Dashboard

### REQ-6.1: Summary Statistics
**As a** user, **I want to** see total analyses and average compatibility **so that** I have a quick overview.

**Scenarios**:
- GIVEN user has analyses WHEN loading dashboard THEN show total count card
- GIVEN user has analyses WHEN loading dashboard THEN show average compatibility score card

### REQ-6.2: Score Evolution Chart
**As a** user, **I want to** see a chart of my scores over time **so that** I can track my improvement.

**Scenarios**:
- GIVEN user has 2+ analyses WHEN loading dashboard THEN show line chart with scores over time
- GIVEN user has fewer than 2 analyses THEN show message "Complete more analyses to see your evolution"

### REQ-6.3: Top Missing Keywords
**As a** user, **I want to** see which keywords I miss most often **so that** I know what to focus on learning.

**Scenarios**:
- GIVEN user has analyses WHEN loading dashboard THEN show bar chart or list of top missing keywords
- GIVEN user has no missing keywords THEN show "Great job! No recurring gaps" message

---

## Technical Requirements

### REQ-T.1: API Client
- All API calls use axios with base URL from environment variable
- Request interceptor attaches auth token from storage
- Response interceptor handles 401 by redirecting to login

### REQ-T.2: Auth Middleware
- Next.js middleware protects all routes under (main) group
- Unauthenticated users are redirected to /login with return URL

### REQ-T.3: Error Handling
- All API errors show user-friendly toast notifications
- Network errors show retry option
- 500 errors show generic error page

### REQ-T.4: Loading States
- All data-fetching components show skeleton loaders
- Form submissions show loading state on buttons
- File upload shows progress indicator

### REQ-T.5: Responsive Design
- All screens are responsive and work on mobile, tablet, and desktop
- Navigation adapts to sidebar on desktop, bottom nav or hamburger on mobile

---

## Acceptance Criteria

1. All 6 modules are implemented with their respective components, hooks, types, and API functions
2. Auth flow works end-to-end: register → login → access protected routes → logout
3. CV upload accepts only PDF files under 10MB with drag & drop and click-to-upload
4. Job input supports both text and URL modes with validation
5. MercadoPago redirect flow works with success/error/pending screens
6. Results display shows score, keywords (present/missing), strengths/weaknesses, and executive summary
7. History lists all analyses with pagination, detail view, and delete functionality
8. Dashboard shows total count, average score, evolution chart, and top missing keywords
9. All routes are protected by middleware
10. All forms use Formik + Yup validation
11. All API calls use React Query for caching and loading states
12. All dates use JavaScript Temporal API
13. File upload is implemented manually (no react-dropzone)
14. Charts use Recharts via shadcn chart component
