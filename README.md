# KaamSetu (कामसेतु) 🌉
> **Tagline:** Fair Pay. Safe Work. Verified Skills.  
> **Category:** Inclusive workforce transparency and worker-protection platform  
> **Benchmark:** United Nations Sustainable Development Goal (SDG) 8 — Decent Work & Economic Growth

---

## 🌟 Executive Summary

**KaamSetu** bridges the trust gap between informal/contract workers and organizational administrators. It provides:
1. **Deterministic FairPay:** Transparent, mathematical line-by-line wage calculations based on verified shifts, approved overtime, allowances, and statutory deductions—with automatic payment discrepancy flagging.
2. **SafeVoice Grievances:** A barrier-free, speech-assisted reporting channel that categorizes safety hazards and payment disputes, generates sequential Case IDs, maintains an immutable status timeline, and enforces ethical user confirmation.
3. **Workforce Risk Radar:** An explainable employer dashboard alerting management to fatigue thresholds (excessive overtime), unresolved safety hazards, and payment gaps—without punitive worker scoring.
4. **Multi-Industry Adaptability:** Supports heavy **Construction** (Metro line, scaffolding hazards, daily wage templates) and **Colleges / Universities** (Facilities maintenance, chemical ventilation, monthly salaries) via dynamic configuration in a single unified codebase.
5. **SkillPassport:** Portable, verified worker credentials (NSDC, National Safety Council) with explicit worker-controlled privacy consent.

---

## 🏗️ Architecture & Technology Stack

```
   Worker Mobile UI                     Employer/Admin Dashboard
(Mobile-first, Voice, Hindi/Eng)         (KPIs, Risk Radar, Audit)
              │                                      │
              └─────────────── React 19 + Vite ──────┘
                                     │
                             HTTPS REST API
                                     │
                             Node.js / Express
                   ┌─────────────────┼──────────────────┐
              Auth / RBAC     Domain Services     SafeVoice AI
             (Demo Session)   ┌──────────────┐   (Keyword + Fallback)
                   │          │ FairPay Pure │          │
                   │          │ Grievance    │          │
                   │          │ Risk Radar   │          │
                   │          └──────────────┘          │
                   └──────────── DataStore ─────────────┘
                               (Embedded JSON /
                              Mongoose Optional)
```

- **Frontend:** React 19, Vite, Vanilla CSS design system tokenized with exact HSL/hex palettes from `ColourGradient.md`, Lucide icons, Web Speech API.
- **Backend:** Node.js (v22), Express, CORS, built-in Node test runner (`node:test`).
- **Database / Storage:** Zero-config embedded repository (`server/data/store.json`) with auto-seeding and live persistence, supporting MongoDB if `MONGODB_URI` is configured.
- **Pure Arithmetic:** Wage calculations are 100% deterministic functions; AI is never used for arithmetic.

---

## 🚀 Quickstart & Setup

### Prerequisites
- Node.js >= 18 (Tested on v22.21.0)
- npm >= 9 (Tested on 10.9.4)

### 1. Installation
In the project root:
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..

# Install frontend dependencies
cd client && npm install && cd ..
```

### 2. Run the Application
Launch both the backend API (port 5000) and the frontend (port 3000) concurrently:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser!

### 3. Run Automated Tests
Execute the deterministic wage math suite and API integration tests:
```bash
npm test
```
*Output: 12 passing tests across FairPay arithmetic, input validation, role-based access control (RBAC), and grievance lifecycles.*

---

## 🎭 Demo Personas & Quick-Switch Toolbar

The top toolbar allows one-click switching between pre-seeded synthetic personas:

| Name | Role | Organization & Industry | Key Demo Journey |
| :--- | :--- | :--- | :--- |
| **Ramesh Kumar** | Worker | Apex Infra (Construction) | Views ₹1,500 wage discrepancy on ₹13,500 expected net pay; submits SafeVoice scaffolding report; tracks Case `KS-CON-2026-001`. |
| **Sunita Devi** | Worker | Apex Infra (Construction) | Structural painter; verified payment match (₹15,850); holds SkillPassport credential. |
| **Vikram Singh** | Admin | Apex Infra (Construction) | Reviews Risk Radar alerts, investigates scaffolding hazard, resolves cases. |
| **Kavita Patel** | Reviewer | Apex Infra (Construction) | Safety & Grievance Officer; assigned to Case `KS-CON-2026-001`. |
| **Rajesh Sharma** | Worker | Navodaya College (Higher Ed) | HVAC technician; reports chemical fume issue (`KS-COL-2026-003`); triggered 14h overtime alert. |
| **Dr. Aruna Rao** | Admin | Navodaya College (Higher Ed) | Registrar; manages college facilities, resolves lab exhaust fan case. |

---

## 📋 5-Minute North-Star Demo Script

1. **Worker Inspects FairPay:**
   - Sign in as **Ramesh Kumar (Worker)**.
   - Click **"View My Pay"**.
   - Notice the large expected net wage: **₹13,500** (22 days @ ₹600 + 5 overtime hours @ ₹120 - ₹300 deductions).
   - Notice the employer recorded payment: **₹12,000**.
   - Expand *"How was this calculated?"* to review the plain-language formula.
   - Click **"Report This Difference"** to immediately lodge an audit grievance without leaving the screen.

2. **Worker Reports Hazard via SafeVoice:**
   - Tap **"Report Concern (SafeVoice)"**.
   - Select **Safety Hazard**.
   - Tap **"Start Speaking"** (or type in the text box):  
     *"Unsafe scaffolding at Block C, planks are loose and missing safety catch nets."*
   - Observe the **SafeVoice AI Assistant** automatically suggest high priority and extract structured summaries.
   - Check the **Confirmation Box** (mandatory human-in-the-loop ethical requirement) and click **"Confirm & Submit Report"**.
   - Receive a unique Case ID (e.g., `KS-CON-2026-004`).

3. **Worker Follows Timeline:**
   - Click **"My Reports"**.
   - Select Case `KS-CON-2026-001` or the new report.
   - View the complete chronological timeline (`submitted` → `under_review` → `investigating`).

4. **Employer Reviews via Workforce Risk Radar:**
   - Switch persona in the top toolbar to **Vikram Singh (Admin)**.
   - View the **Workforce Risk Radar**:
     - Fall hazard pending investigation alert with explicit reason: *"Unresolved High-Severity Safety Grievance exceeded 24-hour response target."*
     - Discrepancy alert showing Ramesh Kumar's ₹1,500 payment gap.
   - Click **"Mark Reviewed"** on the alert.

5. **Employer Resolves Grievance:**
   - Navigate to **"Grievance Resolution"**.
   - Open Case `KS-CON-2026-001`.
   - Enter a resolution note (e.g., *"Site supervisor retrofitted toe-boards and anchored catch nets; certified safe."*) and click **"Mark Resolved"**.
   - Notice that status transitions create immutable audit events.

6. **Switch to Higher Education / College:**
   - Click **"Switch to College"** in the top navigation bar.
   - The platform switches to **Navodaya Institute of Engineering & Technology**.
   - The wage rules adapt to **Monthly Fixed Base (₹20,000)**; site names adapt to **Campus Hostels & Mess Operations**; and grievance categories adapt to institutional facilities concerns!

---

## 🔒 Ethical & Privacy Safeguards

- **Dignity First:** No punitive worker rankings, no surveillance ratings, no opaque quit-prediction algorithms.
- **Deterministic Math:** AI never performs payroll calculations; all monetary figures derive from pure unit-tested code.
- **Worker Confirmation:** AI text transcripts and classifications are always presented as *suggestions* and require the worker's manual review and checkbox confirmation before submission.
- **Strict Role-Based Scoping:** Organization data is strictly isolated; workers can only access their own records.
- **Worker Data Agency:** SkillPassport sharing requires explicit worker consent toggle.

---

## 📁 Repository Structure

```
kaamsetu/
├── client/                     # React 19 + Vite Frontend
│   ├── src/
│   │   ├── components/         # AppShell, DemoDataBanner
│   │   ├── features/
│   │   │   ├── worker/         # Home, FairPay, Attendance, SafeVoice, Reports, Skills
│   │   │   └── admin/          # Risk Radar Overview, Workforce, Grievances, Settings
│   │   ├── lib/                # API client, Translations (EN, HI, MR)
│   │   ├── index.css           # ColourGradient.md design tokens & responsive CSS
│   │   ├── App.jsx             # Main routing & state controller
│   │   └── main.jsx
│   ├── vite.config.js          # Port 3000 & backend proxy (/api -> 5000)
│   └── package.json
├── server/                     # Node.js / Express Backend
│   ├── data/                   # Persistent store.json
│   ├── src/
│   │   ├── models/             # DataStore with JSON file fallback & query filters
│   │   ├── services/           # Pure FairPay arithmetic, Grievance, Risk Radar, AI
│   │   ├── middleware/         # Auth, Org scoping, Rate limiter, Error handler
│   │   ├── routes/             # Auth, Worker, Pay, Grievance, Dashboard, Org
│   │   ├── seed/               # Synthetic Construction & College seed records
│   │   ├── app.js
│   │   └── server.js           # Port 5000 listener
│   ├── tests/                  # Unit & integration test suites
│   │   ├── fairpay.test.js     # Deterministic wage calculations
│   │   └── api.test.js         # REST endpoints & RBAC tests
│   └── package.json
├── docs/                       # Project documentation & specs
├── .env.example
├── package.json                # Root scripts (npm run dev, npm test)
└── README.md
```

---

## 🛠️ Verification & Test Report

```
TAP version 13
# Subtest: KaamSetu API Integration Tests
    ok 1 - Health check returns ok
    ok 2 - Demo users endpoint lists available test personas
    ok 3 - Worker can retrieve own attendance and verified FairPay calculation
    ok 4 - Worker is blocked with 403 when trying to access admin dashboard
    ok 5 - Admin can access Risk Radar summary and alerts
    ok 6 - Worker can submit a new grievance and receive a formatted case ID
    ok 7 - Admin can update grievance status with audit notes
    ok 8 - AI helper endpoint returns structured suggestion without throwing
    ok 9 - Gmail login rejects empty input
    ok 10 - Gmail login rejects non-Gmail address or malformed email
    ok 11 - Gmail login succeeds for existing demo user by email (case-insensitive & trimmed)
    ok 12 - Gmail login dynamically provisions new worker account for any valid arbitrary Gmail
    ok 13 - Logout endpoint succeeds
ok 1 - KaamSetu API Integration Tests (123ms)

# Subtest: FairPay Service - Deterministic Wage Calculations
    ok 1 - correctly calculates daily wage with overtime, additions, and deductions (Worker A Demo Case)
    ok 2 - correctly calculates hourly wage for shift workers
    ok 3 - correctly calculates monthly wage for institutional college staff
    ok 4 - rejects negative numbers and invalid inputs with clear validation errors
ok 2 - FairPay Service - Deterministic Wage Calculations (4ms)

1..2
# tests 17 | pass 17 | fail 0 | cancelled 0
```
