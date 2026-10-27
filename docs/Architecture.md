# Architecture.md --- KaamSetu System Architecture

## Architecture overview

Recommended MVP: React frontend → Express REST API → MongoDB. Optional
AI provider is called from the backend only. Keep core workflows usable
when the AI provider is unavailable.

``` text
Worker Mobile UI                 Employer/Admin Dashboard
        |                                  |
        +---------- React App -------------+
                       |
                 HTTPS REST API
                       |
                 Node.js / Express
           /             |             \
     Auth/RBAC       Domain services    AI adapter
         |          /    |     \            |
         |      FairPay Grievance       LLM/STT provider
         |          |      |
         +-------- MongoDB -------------+
```

## Suggested folder structure

``` text
kaamsetu/
  client/
    src/
      app/
      components/
      features/
        auth/
        attendance/
        fairpay/
        grievances/
        dashboard/
        skills/
      lib/
      pages/
  server/
    src/
      config/
      middleware/
      routes/
      controllers/
      services/
      validators/
      models/
      utils/
      app.js
      server.js
    tests/
  docs/
  .env.example
  README.md
```

## Data model (MVP)

### User

-   `_id`
-   `displayName`
-   `role`: `worker | admin | reviewer`
-   `organizationId`
-   `workerId` (optional)
-   `preferredLanguage`
-   `active`
-   timestamps

### Organization

-   `_id`
-   `name`
-   `industry`: `construction | college`
-   `settings`: wage period, shift rules, overtime threshold, locale
-   timestamps

### Worker

-   `_id`
-   `organizationId`
-   `displayName`
-   `departmentOrSite`
-   `jobRole`
-   `wageType`: `daily | hourly | monthly`
-   `baseRate`
-   `active`
-   timestamps

### AttendanceRecord

-   `_id`
-   `organizationId`
-   `workerId`
-   `date`
-   `regularHours`
-   `overtimeHours`
-   `status`: `draft | submitted | approved | rejected`
-   `source`: `demo | manual | qr`
-   timestamps

### PayRecord

-   `_id`
-   `organizationId`
-   `workerId`
-   `periodStart`
-   `periodEnd`
-   `basePay`
-   `overtimePay`
-   `additions`
-   `deductions`
-   `expectedNetPay`
-   `recordedPayment`
-   `currency`: `INR`
-   `calculationVersion`
-   `status`
-   timestamps

### Grievance

-   `_id`
-   `caseNumber`
-   `organizationId`
-   `workerId` (nullable only for supported anonymous/confidential flow)
-   `category`: `safety | pay | hours | harassment | other`
-   `description`
-   `aiSummary` (optional; clearly marked AI-generated)
-   `priority`: `low | normal | high | urgent`
-   `status`:
    `submitted | under_review | investigating | resolved | reopened`
-   `assignedReviewerId`
-   `resolutionNote`
-   `visibility`: `identified | confidential | anonymous`
-   timestamps

### GrievanceEvent

-   `_id`
-   `grievanceId`
-   `actorId`
-   `eventType`
-   `fromStatus`
-   `toStatus`
-   `note`
-   timestamp

### SkillRecord (stretch)

-   `_id`, `workerId`, `skillName`, `issuer`, `issueDate`, `expiryDate`,
    `verificationStatus`, `evidenceRef`, timestamps.

## API endpoints

### Authentication / session

-   `POST /api/auth/demo-login` --- demo-only login; never use as
    production authentication.
-   `GET /api/auth/me`
-   Production deployments should use a secure authentication provider
    or properly implemented password/session flow.

### Organization and dashboard

-   `GET /api/organizations/current`
-   `GET /api/dashboard/summary`
-   `GET /api/workers`
-   `GET /api/workers/:id`

### Attendance and pay

-   `GET /api/workers/me/attendance?from=&to=`
-   `GET /api/workers/me/pay?period=`
-   `GET /api/workers/:id/attendance?from=&to=` --- admin/reviewer
    policy applies.
-   `GET /api/workers/:id/pay?period=` --- authorized access only.
-   `POST /api/pay/preview` --- deterministic preview from validated
    inputs.
-   `POST /api/pay/:id/flag-discrepancy`

### Grievances

-   `POST /api/grievances`
-   `GET /api/grievances/mine`
-   `GET /api/grievances` --- authorized admin/reviewer only, filtered
    by organization and permissions.
-   `GET /api/grievances/:id`
-   `PATCH /api/grievances/:id/status`
-   `POST /api/grievances/:id/notes`
-   `POST /api/ai/classify-grievance` --- optional; server-side provider
    call.

### Industry configuration and skills

-   `GET /api/organizations/:id/settings`
-   `PATCH /api/organizations/:id/settings` --- admin only.
-   `GET /api/workers/me/skills`
-   `POST /api/workers/me/skills` --- stretch.

## FairPay calculation

Keep a pure, testable function. For an hourly configuration: -
`basePay = regularHours × hourlyRate` -
`overtimePay = approvedOvertimeHours × overtimeRate` -
`expectedNetPay = basePay + overtimePay + additions − deductions`

For daily or monthly pay, use the organization's configured rules.
Validate rates, hours, dates, and deductions. Do not hard-code overtime
multipliers as universal legal rules. Label sample calculations as
demonstration values.

## Security and privacy

-   Enforce organization scoping and role permissions on every protected
    endpoint.
-   Validate and sanitize user input.
-   Store secrets only in server environment variables.
-   Use rate limiting for login and grievance submission.
-   Avoid storing voice recordings by default; retain only confirmed
    transcription if necessary.
-   Minimize personal data and provide explicit consent for optional
    skills sharing.
-   Record admin status changes in an audit trail.
-   Use HTTPS in deployment and secure cookies/token handling
    appropriate to the chosen auth approach.
-   Never let AI decide disciplinary outcomes.
