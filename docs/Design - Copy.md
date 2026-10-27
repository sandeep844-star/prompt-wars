# Design.md --- KaamSetu Product and Interaction Design

## Design principles

1.  **Dignity first**: no stigmatizing labels, surveillance-first
    language, or punitive worker rankings.
2.  **Clarity over density**: one primary action per screen; explain
    numbers in plain language.
3.  **Accessible by default**: large touch targets, readable type,
    strong contrast, icon plus text, and no color-only status
    communication.
4.  **Worker agency**: workers can see their own records, understand
    calculations, and track what happens to their reports.
5.  **Explainable alerts**: every risk alert must show the rule and
    evidence behind it.
6.  **Honest AI**: show AI-generated category/summary as a suggestion,
    allow edits, and require confirmation.

## Information architecture

### Worker

-   Home
-   My Attendance
-   My Pay
-   Report a Concern
-   My Reports
-   My Skills (stretch goal)
-   Language and accessibility settings

### Employer/Admin

-   Overview
-   Workforce
-   Attendance & Pay
-   Grievances
-   Safety & Overtime Alerts
-   Industry Settings
-   Audit/Activity Log (recommended)

## Main workflows

### FairPay

1.  Worker opens My Pay.
2.  Selects a pay period.
3.  Sees total days/hours, base pay, approved overtime, deductions, and
    expected net pay.
4.  Can expand "How was this calculated?"
5.  Can flag a discrepancy; system pre-fills a grievance draft but does
    not submit without confirmation.

### SafeVoice

1.  Worker selects Report a Concern.
2.  Chooses voice or text.
3.  If voice is supported, transcribe and display the text for
    confirmation.
4.  Categorize as wage, safety, hours, harassment/other; allow
    correction.
5.  Show privacy explanation and what information the reviewer can see.
6.  Submit and receive a case ID.
7.  Track status and resolution note.

### Employer review

1.  Admin sees open cases and alerts.
2.  Opens a case and sees only relevant records and the worker's report.
3.  Adds an internal note, assigns reviewer, and updates status.
4.  Records resolution; worker sees the status and permitted resolution
    details.

## UX states

Every data-driven screen must cover: - Loading - Empty - Error/retry -
Success - Permission denied - Offline or network unavailable where
feasible

## Accessibility requirements

-   Minimum 44×44 CSS px touch targets.
-   Keyboard focus indicators.
-   Semantic labels for controls and screen-reader-friendly form errors.
-   Avoid low-contrast text on gradients.
-   Language selection is available before login and in settings.
-   Provide text input when voice input is unavailable.
-   Use short sentences, familiar terms, and optional audio playback for
    wage explanations.
-   Never rely on color alone; include text labels and icons.

## Responsive behavior

-   Mobile-first worker UI with bottom navigation or a compact menu.
-   Desktop employer dashboard with sidebar navigation and content
    panels.
-   Tables become cards on small screens.
-   Avoid horizontal scrolling for primary workflows.

## Content tone

Respectful, plain, action-oriented. Examples: - "Expected pay" -
"Payment recorded" - "Needs review" - "Report submitted" - "Your report
is being reviewed" Avoid accusatory statements such as "Employer cheated
you." Use "The recorded payment differs from the expected amount. Please
review the details."
