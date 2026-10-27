# Ui.md --- KaamSetu Screens, Components, and UI States

## Visual direction

Use a clean, trustworthy workforce SaaS design. Worker screens should
feel simple and reassuring; employer screens should feel structured and
data-rich without becoming crowded.

## Shared application shell

-   Brand: KaamSetu
-   Tagline: Fair Pay. Safe Work. Verified Skills.
-   Language selector available before authentication.
-   Role-aware navigation.
-   Organization/industry switcher for demo purposes.
-   User menu with profile, language, and sign out.
-   Toasts for successful actions and recoverable errors.

## Worker screens

### 1. Home

-   Greeting and current organization/industry.
-   "Today's attendance" card.
-   "Expected pay this period" card.
-   Primary buttons: "View my pay" and "Report a concern".
-   Latest report status.
-   Optional microphone shortcut with text fallback.

### 2. My Attendance

-   Pay-period selector.
-   Summary: days present, approved leave, overtime hours.
-   Simple date list/calendar.
-   Clear label for estimated, submitted, or approved records.

### 3. My Pay / FairPay

-   Large expected net pay figure.
-   Breakdown rows: base wages, overtime, additions, deductions,
    expected net pay.
-   Recorded payment shown separately from expected pay.
-   "How was this calculated?" expandable panel.
-   "Report a difference" action.
-   Disclaimer: demonstration uses configured sample rules; real payroll
    depends on contract and applicable law.

### 4. Report a Concern / SafeVoice

-   Large choices: Safety, Pay, Working Hours, Harassment/Other.
-   Text box and optional microphone.
-   Language indicator.
-   Transcription preview with edit/confirm action.
-   Privacy explanation before submission.
-   Submit button disabled until required details are valid.

### 5. My Reports

-   Case ID, category, date, status, last update.
-   Detail view with submitted description and status timeline.
-   Show only information the worker is authorized to see.

### 6. My Skills (stretch)

-   Skill cards, training, certificates, experience.
-   Verification status: Unverified / Submitted / Verified.
-   Share profile/QR only after explicit consent.

## Employer/Admin screens

### 1. Overview dashboard

-   KPI cards: active workers, attendance today, open grievances,
    overtime alerts.
-   Trend charts using seeded records, labelled "Demo data" where
    applicable.
-   Priority queue of cases needing review.
-   Alert cards include "Why this was flagged".

### 2. Workforce

-   Search/filter workers.
-   Industry, site/department, role, and active status.
-   Detail view with permitted attendance/pay summaries.
-   No public or punitive "employee risk score".

### 3. Attendance & Pay

-   Filter by period and team.
-   Attendance summary and wage calculation inputs.
-   Expected vs recorded payment.
-   Discrepancy status and review action.
-   Export is optional; protect exported data.

### 4. Grievances

-   Filter by category, status, priority, and industry.
-   Case detail: report, created time, category, evidence links,
    assigned reviewer, timeline.
-   Actions: assign, add internal note, mark investigating, resolve,
    reopen.
-   Resolution requires a note; audit status changes.

### 5. Safety & Overtime Alerts

-   Alert reason and rule threshold.
-   Relevant shift/hour data.
-   Suggested action such as "Check schedule with worker".
-   Mark reviewed; do not automatically discipline or penalize workers.

### 6. Industry settings

-   Construction: site, shift, daily/hourly wage templates, safety
    categories.
-   College: department, shift, monthly/daily wage templates, facilities
    categories.
-   Shared logic; configuration changes labels and rules, not core data
    integrity.

## Reusable components

-   `AppShell`
-   `RoleGuard`
-   `LanguageSelector`
-   `IndustrySwitcher`
-   `KpiCard`
-   `PayBreakdown`
-   `AttendanceSummary`
-   `StatusBadge` (always includes text)
-   `GrievanceForm`
-   `GrievanceTimeline`
-   `AlertCard`
-   `EmptyState`
-   `ErrorState`
-   `ConfirmDialog`
-   `VoiceInput`
-   `AccessibleButton`
-   `DemoDataBanner`

## Important states

-   No attendance records: explain that no data has been added for this
    period.
-   No grievances: provide a clear "Report a concern" action.
-   AI unavailable: retain manual category and text submission.
-   Microphone denied: show text entry, do not block the workflow.
-   API failure: show retry and preserve unsent form text when safe.
-   Unauthorized access: show access-denied state and do not return
    protected data.
