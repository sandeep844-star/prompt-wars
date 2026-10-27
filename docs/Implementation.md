# Implementation.md --- KaamSetu Development Plan and Test Matrix

## Phase 0: Repository inspection

-   Identify framework, package manager, existing routes, components,
    and database connection.
-   Run the app and record existing failures before edits.
-   Preserve existing conventions where practical.
-   Create a short implementation checklist and work in small
    increments.

## Phase 1: Application foundation

-   Create worker and admin routes/layouts.
-   Implement responsive design tokens and reusable components.
-   Add demo login and role guard for the prototype.
-   Add construction and college organizations with synthetic data.
-   Add `.env.example` and README setup steps.

Acceptance: - App loads on mobile and desktop. - Role-specific
navigation works. - Demo data is clearly labelled.

## Phase 2: FairPay

-   Add attendance and pay records.
-   Implement deterministic calculation service.
-   Add pay breakdown and expected-vs-recorded comparison.
-   Add discrepancy flag workflow.

Acceptance: - A sample worker can inspect the calculation line by
line. - Inputs are validated. - Tests cover regular pay, overtime,
additions, deductions, and invalid values.

## Phase 3: SafeVoice / grievances

-   Build manual text submission first.
-   Add categories, case number, status timeline, and reviewer actions.
-   Add optional speech-to-text if browser/provider support is
    available.
-   Add AI classification behind an adapter with a manual fallback.
-   Require confirmation of transcript and category before submission.

Acceptance: - Grievance persists after refresh. - Worker sees own cases
only. - Admin sees permitted organization cases only. - Status changes
create history events. - AI failure does not block manual reporting.

## Phase 4: Workforce Risk Radar

-   Calculate alerts from transparent, configurable rules.
-   Show reason and supporting records for each alert.
-   Add open-case queue and reviewed state.

Acceptance: - Alert appears for seeded data meeting the threshold. -
Alert disappears or changes when source data changes. - No automated
disciplinary action is taken.

## Phase 5: Industry configurations

-   Add construction and college labels, departments/sites, and default
    categories.
-   Reuse shared components and services.
-   Validate wage settings separately for each organization.

Acceptance: - Switching organizations changes configuration and sample
data. - Core workflows function in both industries. - Data never leaks
across organizations.

## Phase 6: Polish and demo readiness

-   Add loading, empty, error, and success states.
-   Test keyboard navigation and contrast.
-   Rehearse the end-to-end story.
-   Remove dead buttons and placeholder claims.
-   Add demo reset option if useful.

## Test matrix

  -----------------------------------------------------------------------
  Area                    Test                    Expected result
  ----------------------- ----------------------- -----------------------
  Auth                    Worker opens admin      403/access denied
                          endpoint                

  Data isolation          User requests another   No data returned
                          organization's worker   

  FairPay                 Known hours/rate inputs Exact expected
                                                  calculation

  FairPay                 Negative hours or       Validation error
                          invalid rate            

  Grievance               Worker submits valid    Case ID and submitted
                          report                  status

  Grievance               Worker opens another    Access denied
                          worker's case           

  Grievance               Admin updates status    Status persists and
                                                  event is logged

  AI fallback             AI provider unavailable Manual submission still
                                                  works

  Voice fallback          Microphone permission   Text entry remains
                          denied                  available

  Alerts                  Hours exceed configured Explainable alert
                          threshold               appears

  Industry                Switch construction to  Correct settings and
                          college                 records appear

  Responsive              360px-wide viewport     No blocking horizontal
                                                  overflow

  Accessibility           Keyboard-only           Focus visible and
                          navigation              actions reachable
  -----------------------------------------------------------------------

## Suggested demo data

Use fictional records: - Worker A: 22 recorded days, configured daily
rate ₹600, 5 approved overtime hours. - Use an explicitly configured
overtime rate in the demo settings; do not imply it is a universal
statutory rate. - Recorded payment intentionally differs from the
calculated expected payment so the discrepancy flow can be
demonstrated. - One high-priority safety report and one unresolved wage
report. - A college maintenance worker with a facilities complaint.

## Final evidence checklist

-   Screenshot of worker home.
-   Screenshot of pay breakdown and discrepancy.
-   Screenshot of submitted grievance and status timeline.
-   Screenshot of employer dashboard and alert rationale.
-   Short recording of end-to-end workflow.
-   README with setup instructions, demo credentials, limitations, and
    test commands.
