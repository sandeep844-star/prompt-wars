# PRD.md --- KaamSetu Product Requirements Document

## 1. Product summary

**Product:** KaamSetu\
**Tagline:** Fair Pay. Safe Work. Verified Skills.\
**Category:** Inclusive workforce transparency and worker-protection
platform\
**Target prototype:** A working hackathon MVP that supports construction
and college staff.

KaamSetu helps workers understand how wages are calculated, report
workplace concerns in accessible ways, and track their cases. Employers
receive clear, explainable workforce indicators and workflows to
investigate concerns earlier.

## 2. Problem statement

Many organizations still manage workforce information through paper
registers, spreadsheets, and informal messaging. Workers may not
understand wage calculations, hesitate to report problems, or lack
portable records of their skills. Employers can lack timely visibility
into overtime, unresolved complaints, and recurring safety issues. A
solution must work for users with regional-language preferences, limited
reading confidence, and basic smartphones.

## 3. Goals

-   Make wage calculations understandable and reviewable.
-   Provide a safe, trackable grievance workflow.
-   Help employers identify overtime and unresolved issues early.
-   Support at least two industries through configuration rather than
    separate apps.
-   Demonstrate inclusive UX, credible technical implementation, and SDG
    8 relevance.

## 4. Non-goals for the MVP

-   Processing real salary payments or connecting to bank accounts.
-   Claiming legal compliance across all regions or employment types.
-   Automatically determining employer wrongdoing.
-   Automated worker scoring, disciplinary decisions, or opaque quit
    prediction.
-   Full production-grade identity verification.
-   Blockchain-based credentials unless a concrete need is demonstrated.
-   Storing voice recordings by default.

## 5. Target users

### Worker

Needs a simple way to understand pay, report concerns, and follow case
progress. May prefer voice or a regional language.

### Employer/Admin

Needs to review attendance/pay records, identify explainable exceptions,
and resolve concerns.

### Reviewer

Needs restricted access to assigned cases and a traceable review
workflow.

## 6. MVP features and requirements

### P0 --- FairPay

-   Display attendance inputs and pay-period summary.
-   Show base pay, approved overtime, additions, deductions, and
    expected net pay.
-   Show recorded payment separately.
-   Flag a discrepancy and allow the worker to open a prefilled
    grievance.
-   Explain the calculation in plain language.

### P0 --- SafeVoice / Grievances

-   Accept text reports; support voice input when available.
-   Let worker confirm the transcript and category.
-   Generate a case number.
-   Track submitted, under review, investigating, resolved, and reopened
    statuses.
-   Allow authorized reviewers to add notes and a resolution.
-   Explain who can see the report and what confidentiality means.

### P0 --- Workforce Risk Radar

-   Show attendance, overtime, open grievances, and safety alerts.
-   Use configurable thresholds and transparent reasons.
-   Let an authorized admin mark alerts reviewed.
-   Do not use alerts as automatic evidence of misconduct.

### P0 --- Two industry configurations

-   Construction: sites, shifts, wage templates, safety hazards.
-   College: departments, staff shifts, facilities/maintenance concerns.
-   Shared user, pay, and grievance workflows.

### P1 --- SkillPassport

-   Add skills and training records.
-   Track verification status.
-   Allow sharing only with worker consent.

### P1 --- Multilingual support

-   Provide interface labels in selected languages.
-   Add voice/text support where technically feasible.
-   Always provide a manual fallback.

## 7. Success criteria

-   A judge can complete the full demo journey in under five minutes.
-   A pay breakdown is traceable to inputs and configurable rules.
-   A submitted grievance persists and can be reviewed by an authorized
    admin.
-   Worker access is restricted to their own records.
-   Construction and college workflows both work.
-   Core flows remain usable when AI or microphone access is
    unavailable.
-   No primary workflow contains dead buttons.

## 8. User stories

-   As a worker, I want to see how my expected pay was calculated so
    that I can understand the amount.
-   As a worker, I want to report a concern in simple language so that I
    can raise an issue without completing a long form.
-   As a worker, I want a case number and status so that I can track
    progress.
-   As an admin, I want to see wage discrepancies and unresolved
    concerns so that I can investigate them.
-   As a reviewer, I want a history of status changes so that the
    resolution process is accountable.
-   As an organization, I want to configure the same platform for
    different industries without building separate applications.

## 9. Constraints and assumptions

-   Prototype uses synthetic data.
-   Internet connectivity is expected for cloud-hosted features; manual
    text flow should be lightweight.
-   AI, speech recognition, and translation quality depend on
    provider/browser support.
-   Wage rules are configurable and must be reviewed before real-world
    use.
-   Anonymous reporting is only supported if identity is not collected
    or exposed through metadata and workflows.

## 10. Risks and mitigations

-   **Incorrect AI interpretation:** show preview, allow editing,
    require confirmation.
-   **False wage alerts:** show inputs and calculation details; support
    review.
-   **Privacy concerns:** minimize data, scope access, explain
    confidentiality.
-   **Poor connectivity:** keep forms lightweight and show retry states.
-   **Over-scoping:** prioritize FairPay, grievances, dashboard, and two
    configurations before SkillPassport.
-   **False confidence from demo data:** label synthetic/demo records
    clearly.

## 11. Demo definition

Worker signs in → views expected pay and calculation → reports a wage or
safety issue → receives a case number → employer reviews the case and
updates status → user switches to a college organization and
demonstrates the shared workflow.
