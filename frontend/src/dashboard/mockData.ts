// Static mock data for the manager dashboard UI. Deliberately not wired to
// the backend yet (see docs/phase-plan.md) - shapes mirror what
// GET /api/reports/leads, GET /api/reports/active-status, and a future
// call-activity endpoint will eventually return, so swapping this out for
// real fetches later is a data-layer change, not a UI rewrite.

export const currentManager = {
  name: 'Sarah Anderson',
  initials: 'SA',
  role: 'Sales Manager',
}

export type StatVariant = 'default' | 'danger'

export interface OverviewStat {
  label: string
  eyebrow: string
  value: string
  detail: string
  variant: StatVariant
  progress?: number
}

export const overviewStats: OverviewStat[] = [
  {
    label: 'Total Leads',
    eyebrow: '',
    value: '1,284',
    detail: '+12.4% vs last week',
    variant: 'default',
  },
  {
    label: 'Active Calls',
    eyebrow: '',
    value: '14',
    detail: 'Real-time tracking active',
    variant: 'default',
  },
  {
    label: 'Calls Today',
    eyebrow: '',
    value: '42',
    detail: 'Out of 120 target',
    variant: 'default',
  },
  {
    label: 'Conversion',
    eyebrow: 'AI Engine / Active',
    value: '18.5%',
    detail: '',
    variant: 'default',
    progress: 62,
  },
  {
    label: 'Pending',
    eyebrow: 'System / Friday',
    value: '42',
    detail: 'Follow-ups scheduled',
    variant: 'default',
  },
  {
    label: 'Overdue',
    eyebrow: 'Data Sync / Live',
    value: '8',
    detail: 'Requires immediate action',
    variant: 'danger',
  },
]

export const performanceSummary = [
  { label: 'Top Performer', name: 'Priya S.', metric: '82% Success', tone: 'default' as const },
  { label: 'Needs Attention', name: 'Karthik R.', metric: '55% Success', tone: 'danger' as const },
  { label: 'Team Average', name: 'All Employees', metric: '70% Success', tone: 'default' as const },
]

export interface EmployeePerformancePoint {
  employee: string
  successRate: number
  failureRate: number
}

export const employeePerformance: EmployeePerformancePoint[] = [
  { employee: 'Priya S.', successRate: 82, failureRate: 18 },
  { employee: 'Rahul K.', successRate: 75, failureRate: 25 },
  { employee: 'Arjun M.', successRate: 68, failureRate: 32 },
  { employee: 'Karthik R.', successRate: 55, failureRate: 45 },
  { employee: 'Meera S.', successRate: 72, failureRate: 28 },
]

export interface AiInsight {
  tag: string
  timeAgo: string
  title: string
  body: string
  tone: 'default' | 'warning' | 'info'
}

export const overviewInsights: AiInsight[] = [
  {
    tag: 'Trend Identified',
    timeAgo: '2h ago',
    title: '',
    body: 'Priya S. has the highest success rate this period.',
    tone: 'info',
  },
  {
    tag: 'Performance Alert',
    timeAgo: '4h ago',
    title: '',
    body: 'Karthik R. has a significantly higher failure rate than the team average.',
    tone: 'warning',
  },
  {
    tag: 'Coaching Opportunity',
    timeAgo: '5h ago',
    title: '',
    body: 'Employees with lower success rates show difficulty handling price objections.',
    tone: 'info',
  },
  {
    tag: 'Top Performer',
    timeAgo: '12h ago',
    title: '',
    body: 'Priya S. — 82% success rate.',
    tone: 'info',
  },
]

export type CallOutcome = 'Positive' | 'Escalate' | 'Neutral' | 'Risk'

export interface RecentCall {
  callId: string
  lead: string
  employee: string
  time: string
  duration: string
  outcome: CallOutcome
  status: string
}

export const recentCalls: RecentCall[] = [
  {
    callId: '#C-8842',
    lead: 'Acme Corp Т...',
    employee: 'Priya S.',
    time: '10:14 AM',
    duration: '04:22',
    outcome: 'Positive',
    status: 'Closed',
  },
  {
    callId: '#C-8841',
    lead: 'Globex Dyna...',
    employee: 'David K.',
    time: '09:55 AM',
    duration: '12:45',
    outcome: 'Escalate',
    status: 'Review',
  },
  {
    callId: '#C-8840',
    lead: 'Initech Soluti...',
    employee: 'Alex R.',
    time: '09:30 AM',
    duration: '02:15',
    outcome: 'Neutral',
    status: 'Voicemail',
  },
  {
    callId: '#C-8839',
    lead: 'Stark Ind.',
    employee: 'Sarah A.',
    time: '09:05 AM',
    duration: '08:50',
    outcome: 'Positive',
    status: 'Follow-up',
  },
  {
    callId: '#C-8838',
    lead: 'Wayne Ent.',
    employee: 'David K.',
    time: '08:45 AM',
    duration: '15:20',
    outcome: 'Risk',
    status: 'Lost',
  },
]

export interface TeamActivityRow {
  name: string
  successRate: number
  callsToday: number
  note: string
  tone: 'default' | 'danger'
}

export const teamActivity: TeamActivityRow[] = [
  { name: 'Priya S.', successRate: 82, callsToday: 24, note: 'Top Performer', tone: 'default' },
  { name: 'David K.', successRate: 45, callsToday: 18, note: 'Needs Review', tone: 'danger' },
  { name: 'Alex R.', successRate: 64, callsToday: 12, note: 'On Track', tone: 'default' },
]

export interface AttentionItem {
  title: string
  body: string
  icon: 'flag' | 'sentiment' | 'sync'
}

export const attentionItems: AttentionItem[] = [
  {
    title: '8 Overdue Follow-ups',
    body: 'High-value leads aging past 48h SLA.',
    icon: 'flag',
  },
  {
    title: 'Negative Sentiment Spike',
    body: "David K.'s last 3 calls flagged by AI.",
    icon: 'sentiment',
  },
  {
    title: 'CRM Sync Delay',
    body: 'Pipeline data is 15 mins behind.',
    icon: 'sync',
  },
]

// --- Lead Management ---------------------------------------------------

export const leadStats = [
  { label: 'Total Active Leads', value: '1,284', detail: '+12%', variant: 'default' as const },
  { label: 'Unassigned', value: '42', detail: '', variant: 'default' as const },
  { label: 'High Priority', value: '18', detail: '', variant: 'danger' as const },
  { label: 'In Progress', value: '342', detail: '', variant: 'default' as const },
  { label: 'Converted YTD', value: '238', detail: '', variant: 'default' as const },
]

export interface PipelineStage {
  stage: string
  share: number
  color: string
}

export const pipelineDistribution: PipelineStage[] = [
  { stage: 'New', share: 18, color: '#c7d3f7' },
  { stage: 'Contacted', share: 27, color: '#8fa4ec' },
  { stage: 'Interested', share: 25, color: '#5773e0' },
  { stage: 'Callback', share: 10, color: '#2f4dd4' },
  { stage: 'Converted', share: 20, color: '#1d3fd6' },
]

export type LeadStatus = 'New' | 'Interested' | 'Callback' | 'Not Interested'
export type LeadPriority = 'High' | 'Medium' | 'Low'

export interface Lead {
  name: string
  company: string
  status: LeadStatus
  priority: LeadPriority
  assignedTo: { name: string; initials: string } | null
  unassigned?: boolean
  fridayScore: number
  closed?: boolean
}

export const leads: Lead[] = [
  {
    name: 'Ravi Kumar',
    company: 'MedTech Solutions',
    status: 'Interested',
    priority: 'High',
    assignedTo: { name: 'Priya Sharma', initials: 'PS' },
    fridayScore: 0.8,
  },
  {
    name: 'Anita Sharma',
    company: 'HealthCore',
    status: 'Callback',
    priority: 'Medium',
    assignedTo: { name: 'Arun Kumar', initials: 'AK' },
    fridayScore: 0.55,
  },
  {
    name: 'Arun Menon',
    company: 'BioSystems',
    status: 'New',
    priority: 'High',
    assignedTo: null,
    unassigned: true,
    fridayScore: 0.35,
  },
  {
    name: 'Karthik Raj',
    company: 'LifeTech',
    status: 'Not Interested',
    priority: 'Low',
    assignedTo: { name: 'Priya Sharma', initials: 'PS' },
    fridayScore: 0.1,
    closed: true,
  },
]

export interface LeadInsights {
  priorityAlert: string
  intelligence: string
  modelStatus: string
}

export const leadInsights: LeadInsights = {
  priorityAlert: '18 high-priority leads have no scheduled follow-up.',
  intelligence:
    '7 leads showing strong buying intent based on recent engagement patterns.',
  modelStatus: 'Predictive Scoring v2.4',
}
