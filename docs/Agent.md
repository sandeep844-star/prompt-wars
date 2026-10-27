# Agent.md --- KaamSetu Build Agent Instructions

## Mission

Build **KaamSetu**, a mobile-first worker-protection platform that makes
work fairer, safer, and more transparent. It must support two industry
configurations: construction and colleges.

## Core product outcomes

1.  Workers can view attendance and a transparent wage breakdown.
2.  Workers can submit a text or voice-assisted grievance and track its
    status.
3.  Employers can review workforce indicators, wage discrepancies,
    overtime alerts, and grievances.
4.  The same application supports construction and college staff through
    configurable settings.
5.  The UI is accessible to users with limited literacy and basic
    smartphones.

## Required personas and roles

-   **Worker**: view own attendance/pay, submit and track grievances,
    manage skill records.
-   **Employer/Admin**: manage demo workers, review attendance/pay
    records, review grievances, resolve cases, view workforce alerts.
-   **Reviewer** (optional): can investigate assigned cases without
    managing payroll.

Enforce role-based access in the backend, not only by hiding UI
elements.

## MVP scope

Implement in this order: 1. Responsive application shell and role-based
demo login. 2. Seeded demo data for a construction site and a college.
3. Attendance records and deterministic FairPay calculation. 4.
Grievance submission, category/priority, case ID, status lifecycle. 5.
Employer dashboard with overtime and open-grievance alerts. 6. Industry
selector/configuration. 7. Voice input or a graceful text-entry
fallback. 8. Optional SkillPassport screen if time permits.

## Engineering rules

-   Inspect the existing repository and preserve its conventions before
    changing files.
-   Do not rewrite the project wholesale unless the repository is empty
    or unusable.
-   Keep wage calculations deterministic and unit-tested. Never ask an
    LLM to calculate payroll arithmetic.
-   Treat AI output as a suggestion. Require user confirmation before
    creating a grievance from speech/AI interpretation.
-   Clearly distinguish verified records from worker-submitted claims.
-   Do not claim anonymity if identity can be inferred by admins. Use
    "confidential" only when permissions and storage support it.
-   Never expose secrets or API keys in frontend code. Use environment
    variables and provide `.env.example`.
-   Validate inputs on the server; use safe error messages; do not store
    unnecessary sensitive personal data.
-   Use synthetic demo data only. Do not use real workers' personal or
    payroll information.
-   Make the core flow usable without AI credentials or microphone
    permissions.
-   Add loading, empty, error, and success states for all key workflows.
-   Avoid dead buttons, fake metrics presented as live data, and
    non-functional navigation.

## Quality gates

-   App starts using documented commands.
-   Worker and employer/admin experiences are distinguishable.
-   Wage breakdown can be traced to input records and rules.
-   Grievance status persists after refresh.
-   Employer can review and update a grievance.
-   Construction and college configurations both work.
-   Responsive layout works on mobile and desktop.
-   Critical calculations and permissions have tests.
-   README explains setup, demo accounts, limitations, and demo script.

## Definition of done

A judge can complete the demo journey without developer intervention:
worker signs in → reviews pay → reports a safety/wage issue → employer
reviews it → status is updated → switch industry and show the same
system adapted to a college.
