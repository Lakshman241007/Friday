// Static mock data for /dashboard/follow-ups. Same deal as the other
// dashboard datasets - not wired to a backend endpoint (there isn't one
// yet for follow-ups).

export type StatTone = 'default' | 'info' | 'warning'

export const followUpStats: { label: string; value: string; tone: StatTone }[] = [
  { label: 'Total Follow-ups', value: '186', tone: 'default' },
  { label: 'Due Today', value: '42', tone: 'info' },
  { label: 'Overdue', value: '18', tone: 'warning' },
  { label: 'Completed', value: '126', tone: 'default' },
  { label: 'High Priority', value: '11', tone: 'warning' },
]

export type FollowUpPriority = 'high' | 'normal'
export type FollowUpFilter = 'all' | 'today' | 'overdue' | 'upcoming' | 'completed'

export interface FollowUp {
  priority: FollowUpPriority
  lead: string
  company: string
  task: string
  assignedTo: string
  due: string
  status: FollowUpFilter
}

export const followUps: FollowUp[] = [
  {
    priority: 'high',
    lead: 'Ravi Kumar',
    company: 'MedTech Solutions',
    task: 'Send pricing proposal',
    assignedTo: 'Priya Sharma',
    due: 'Today, 10:30 AM',
    status: 'today',
  },
  {
    priority: 'normal',
    lead: 'Anita Sharma',
    company: 'HealthCore',
    task: 'Schedule product demo',
    assignedTo: 'David Kumar',
    due: 'Today, 2:00 PM',
    status: 'today',
  },
  {
    priority: 'high',
    lead: 'Arun Menon',
    company: 'BioSystems',
    task: 'Call regarding contract',
    assignedTo: 'Alex Raj',
    due: 'Yesterday',
    status: 'overdue',
  },
  {
    priority: 'normal',
    lead: 'Meera Shah',
    company: 'LifeTech',
    task: 'Send product brochure',
    assignedTo: 'Priya Sharma',
    due: 'Tomorrow',
    status: 'upcoming',
  },
  {
    priority: 'normal',
    lead: 'Neha Verma',
    company: 'Vertex Labs',
    task: 'Send onboarding guide',
    assignedTo: 'Alex Raj',
    due: 'Completed',
    status: 'completed',
  },
]

export interface TimelineItem {
  time: string
  title: string
  subtitle?: string
  done?: boolean
  next?: boolean
}

export const timelineItems: TimelineItem[] = [
  { time: '09:30 AM', title: 'Team Standup', done: true },
  {
    time: '10:30 AM',
    title: 'Send pricing proposal',
    subtitle: 'Ravi Kumar • MedTech',
    next: true,
  },
  { time: '12:00 PM', title: 'Client Sync - LifeTech' },
]

export const aiFollowUpInsight = {
  boldName: 'Ravi Kumar',
  text: 'has not responded for 22 hours. A follow-up today is recommended.',
}

export interface AttentionFollowUp {
  lead: string
  task: string
  overdueBy: string
}

export const attentionFollowUps: AttentionFollowUp[] = [
  { lead: 'Arun Menon', task: 'Call regarding contract', overdueBy: '1d' },
  { lead: 'Karthik Raj', task: 'Send technical docs', overdueBy: '2d' },
]
