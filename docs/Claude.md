# Claude.md --- Project Context and Coding Assistant Rules

You are the engineering assistant for **KaamSetu**, a hackathon
prototype for fairer, safer, more transparent work. Read `Prd.md`,
`Agent.md`, `Design.md`, `Ui.md`, `Architecture.md`,
`Implementation.md`, and `ColourGradient.md` before implementing major
changes.

## North-star demo

A worker views a transparent wage calculation, submits a safety or wage
grievance, tracks its status, and an authorized employer/admin reviews
and resolves it. Then the same platform is shown configured for
construction and a college.

## Priority order

1.  Functional worker and employer/admin interfaces.
2.  Deterministic FairPay calculation and wage discrepancy workflow.
3.  Persistent grievance submission, review, and status timeline.
4.  Explainable overtime/safety dashboard alerts.
5.  Industry configuration for construction and colleges.
6.  Multilingual/voice improvements.
7.  SkillPassport as a stretch goal.

## Working method

-   Inspect repository and run existing tests before editing.
-   Propose a concise plan for multi-file changes.
-   Implement in small, verifiable increments.
-   Keep components reusable and code readable.
-   Do not replace existing architecture without explaining why.
-   After each phase, run relevant tests/build and report what passed
    and what remains.
-   If a dependency or API key is missing, implement a working fallback
    rather than blocking the MVP.

## Technical constraints

-   React frontend, Node.js/Express backend, MongoDB where available.
-   Keep API keys server-side and use `.env.example`.
-   Use role-based access checks in backend middleware and
    organization-scoped database queries.
-   Use deterministic functions for wage arithmetic.
-   Treat AI output as untrusted suggestions; require confirmation for
    report submission.
-   Use synthetic records only.
-   Do not make unsupported claims about legal compliance, anonymity,
    accuracy, or predictive ability.
-   Never add fake success states or nonfunctional controls.
-   Provide accessible labels, visible focus, responsive layouts, and
    text fallback for voice.

## UI requirements

-   Follow the palette in `ColourGradient.md`.
-   Worker UI: mobile-first, simple language, large touch targets, clear
    primary actions.
-   Admin UI: clear KPI cards, review queue, filters, and explainable
    alerts.
-   Include loading, empty, error, and success states.
-   Use status text as well as color.
-   Clearly label demo data.

## Completion report

At the end, report: 1. Files created/changed. 2. Features implemented.
3. Commands run and test/build results. 4. Environment variables needed.
5. Known limitations. 6. Exact steps to run the demo. 7. Remaining work
ranked by importance.

Do not claim a feature works unless it has been implemented and tested
or explicitly label it as a prototype/mock.
