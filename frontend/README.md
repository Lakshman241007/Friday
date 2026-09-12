# Friday — Manager Dashboard (Frontend)

React + TypeScript + Vite + Tailwind CSS v4. Talks to the FastAPI backend
in `../app`.

## Setup

```bash
npm install
npm run dev      # http://localhost:5173, proxies /api -> http://localhost:8000
```

## Pages

- `/` — Home / landing page.
- `/login` — Manager login. **Hardcoded demo credentials only** (no auth
  backend yet - see `../docs/phase-plan.md`): `demo@gmail.com` / `democall`.
- `/dashboard` — Protected (client-side session check only, not a real auth
  boundary). Overview: stat cards, employee performance chart, AI insights,
  recent call activity, team activity, attention-required panel.
- `/dashboard/leads` — Lead Management: lead stats, pipeline distribution,
  searchable/filterable leads table, AI insights sidebar.
- `/dashboard/calls` — Call Monitoring: live calls table with AI signal
  badges, a live AI-intelligence event feed, recently completed calls.
- `/dashboard/calls/:callId` — Call Details: AI summary + recommendation,
  detected signals, conversation analysis, AI call score, a sentiment-arc
  chart with a concern annotation, and an annotated transcript (AI-signal
  and objection phrases highlighted). Reached by clicking a Recently
  Completed row; full mock records exist for C-1024, C-1023, C-1022 -
  any other id renders a "call not found" state rather than fake data.
- `/dashboard/follow-ups` — Follow-ups: total/due-today/overdue/completed/
  high-priority stats strip, a searchable and tab-filterable follow-ups
  table (All/Due Today/Overdue/Upcoming/Completed), a Timeline sidebar
  (today's schedule, a Friday AI insight callout, an attention-required
  list of overdue items).
- `/dashboard/performance` — placeholder page; not designed yet.

Sidebar nav is Dashboard, Lead Management, Call Monitoring, Performance,
Follow-ups. Alerts and Reports were removed (no design for them).

- `/employee` — **Employee Dashboard, mobile UI only.** A separate,
  standalone page for an individual call agent (not the manager persona):
  top bar (logo, profile, menu), an AI-online status pill, a horizontally
  scrolling stat-card carousel, a Weekly Activity bar chart with the
  current day highlighted, a Friday Insights callout tied to a specific
  lead, an Active Leads list, and a sticky bottom Quick Call / Review
  action bar. Renders full-width on real mobile viewports; on wider
  screens it shows as a centered fixed-height phone-frame mockup with
  internal scroll rather than stretching into a desktop layout - it was
  built mobile-only, not responsive. Not nested under `DashboardLayout`
  (different chrome entirely) and **not behind any login** - there's no
  employee-auth flow yet, unlike the manager's hardcoded gate.

**All dashboard data is static mock data** (`src/dashboard/mockData.ts`,
`callMonitoringData.ts`, `callDetailData.ts`, `followUpsData.ts`,
`employee/mockData.ts`) - deliberately not wired to the backend yet.
Swapping Overview/Lead Management for real fetches against
`GET /api/reports/leads`, `GET /api/reports/active-status`, and
`GET/POST /api/agents` is a data-layer change, not a UI rewrite - the mock
shapes were written to mirror what those endpoints return. Call Monitoring,
Call Details, Follow-ups, and the Employee Dashboard have no backend
endpoint yet at all (not part of Phase 8).

## Structure

```
src/
  pages/            Home, Login
  components/        ProtectedRoute
  lib/auth.ts         Hardcoded credential check + sessionStorage session flag
  dashboard/
    layout/            DashboardLayout, Sidebar, Topbar
    components/        StatCard, Badge, Card, ProgressBar, charts, tables, insight panels
    pages/              Overview, LeadManagement, CallMonitoring, CallDetails, FollowUps, PlaceholderPage
    mockData.ts         Typed mock data for Overview + Lead Management
    callMonitoringData.ts   Typed mock data for Call Monitoring
    callDetailData.ts       Typed mock data + getCallDetail() lookup for Call Details
    followUpsData.ts        Typed mock data for Follow-ups
    icons.tsx           Inline SVG icon set (no icon-library dependency)
  employee/
    pages/EmployeeDashboard.tsx   The mobile employee dashboard page
    components/                    TopBar, StatCarousel, WeeklyActivityChart, InsightCard, LeadCard, BottomActionBar
    mockData.ts                    Typed mock data for the employee dashboard
    icons.tsx                      Icons unique to this view (reuses dashboard/icons.tsx for the rest)
```

## Build

```bash
npm run build   # tsc -b && vite build, output in dist/
```
