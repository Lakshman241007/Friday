// Static mock data for /dashboard/calls. Same deal as mockData.ts - not
// wired to the backend, shaped so a later swap to real call-activity
// endpoints is a data-layer change.

export const callMonitoringStats = [
  { label: 'Active Calls', value: '14', icon: 'phone' as const, tinted: false },
  { label: 'Calls Today', value: '42', icon: 'history' as const, tinted: false },
  { label: 'Avg Duration', value: '04:38', icon: 'stopwatch' as const, tinted: false },
  { label: 'AI Flags', value: '7', icon: 'warning' as const, tinted: true },
  { label: 'High Priority', value: '3', icon: 'exclamation' as const, tinted: true },
]

export type AiSignalTone = 'warning' | 'info' | 'neutral'

export interface LiveCall {
  callId: string
  rep: string
  company: string
  duration: string
  signal: { label: string; tone: AiSignalTone }
  highlighted?: boolean
}

export const liveCalls: LiveCall[] = [
  {
    callId: 'C-1024',
    rep: 'Sarah Jenkins',
    company: 'Acme Corp',
    duration: '08:12',
    signal: { label: 'Pricing Concern', tone: 'warning' },
    highlighted: true,
  },
  {
    callId: 'C-1025',
    rep: 'Marcus Thorne',
    company: 'Globex Inc',
    duration: '03:45',
    signal: { label: 'Buying Intent', tone: 'info' },
  },
  {
    callId: 'C-1026',
    rep: 'Elena Rodriguez',
    company: 'Stark Ind.',
    duration: '12:04',
    signal: { label: 'Neutral', tone: 'neutral' },
  },
]

export interface AiIntelligenceEvent {
  time: string
  title: string
  callRef: string
  tone: AiSignalTone
  quote?: string
  muted?: boolean
}

export const aiIntelligenceFeed: AiIntelligenceEvent[] = [
  {
    time: '10:22:14',
    title: 'Pricing concern detected',
    callRef: 'C-1024',
    tone: 'warning',
    quote:
      '"We really like the feature set, but the annual commitment is steep for our current budget cycle ..."',
  },
  {
    time: '10:21:48',
    title: 'Strong buying intent',
    callRef: 'C-1025',
    tone: 'info',
  },
  {
    time: '10:19:02',
    title: 'Competitor mentioned (Salesforce)',
    callRef: 'C-1021',
    tone: 'neutral',
    muted: true,
  },
  {
    time: '10:15:33',
    title: 'Objection handled successfully',
    callRef: 'C-1018',
    tone: 'neutral',
    muted: true,
  },
]

export interface CompletedCall {
  callId: string
  rep: string
  company: string
  duration: string
  outcome: { label: string; tone: 'info' | 'warning' }
  sentiment: number
  completedAt: string
}

export const completedCalls: CompletedCall[] = [
  {
    callId: 'C-1023',
    rep: 'David Chen',
    company: 'Wayne Ent.',
    duration: '14:22',
    outcome: { label: 'Meeting Booked', tone: 'info' },
    sentiment: 0.82,
    completedAt: '10:18 AM',
  },
  {
    callId: 'C-1022',
    rep: 'Sarah Jenkins',
    company: 'Oscorp',
    duration: '05:11',
    outcome: { label: 'Follow Up Required', tone: 'warning' },
    sentiment: 0.32,
    completedAt: '10:05 AM',
  },
]
