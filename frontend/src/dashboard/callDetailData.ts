// Static mock data for /dashboard/calls/:callId. Only calls actually linked
// to from the app (Recently Completed rows on /dashboard/calls) have full
// records here; getCallDetail() returns undefined for anything else and the
// page renders a "not found" state rather than fabricating data on the fly.

export type TranscriptTone = 'signal' | 'objection'

export interface TranscriptPart {
  text: string
  tone?: TranscriptTone
}

export interface TranscriptLine {
  time: string
  speaker: 'EMP' | 'CUST'
  parts: TranscriptPart[]
}

export interface DetectedSignal {
  icon: 'cart' | 'objection' | 'smiley' | 'flag'
  label: string
  value: string
}

export interface ScoreBreakdownItem {
  label: string
  value: number
}

export interface SentimentPoint {
  t: string
  value: number
}

export interface CallDetail {
  callId: string
  leadName: string
  company: string
  status: 'Completed'
  completedAt: string
  duration: string
  employee: string
  aiScore: number
  sentimentLabel: string
  outcome: string
  summary: string
  keyRecommendation: string
  signals: DetectedSignal[]
  talkTime: { emp: number; cust: number }
  questions: number
  objections: number
  signalsCount: number
  followUpRequired: boolean
  scoreBreakdown: ScoreBreakdownItem[]
  sentimentArc: SentimentPoint[]
  concernIndex: number
  transcript: TranscriptLine[]
}

const callDetails: Record<string, CallDetail> = {
  'C-1024': {
    callId: 'C-1024',
    leadName: 'Ravi Kumar',
    company: 'MedTech Solutions',
    status: 'Completed',
    completedAt: '17 Aug 2026, 10:18 AM',
    duration: '06:12',
    employee: 'Priya Sharma',
    aiScore: 86,
    sentimentLabel: 'Positive',
    outcome: 'Interested',
    summary:
      'Customer showed strong interest in the enterprise package. The main objection was pricing. The customer requested a follow-up with detailed pricing information.',
    keyRecommendation: 'Send enterprise pricing proposal and follow up within 24 hours',
    signals: [
      { icon: 'cart', label: 'Buying Intent', value: 'High' },
      { icon: 'objection', label: 'Pricing Objection', value: 'Detected' },
      { icon: 'smiley', label: 'Positive Sentiment', value: '78%' },
      { icon: 'flag', label: 'Follow-up Request', value: 'Detected' },
    ],
    talkTime: { emp: 46, cust: 54 },
    questions: 8,
    objections: 2,
    signalsCount: 5,
    followUpRequired: true,
    scoreBreakdown: [
      { label: 'Engagement', value: 88 },
      { label: 'Intent', value: 91 },
      { label: 'Communication', value: 82 },
      { label: 'Outcome Prob.', value: 85 },
    ],
    sentimentArc: [
      { t: '00:00', value: 68 },
      { t: '00:45', value: 74 },
      { t: '02:10', value: 72 },
      { t: '03:22', value: 38 },
      { t: '04:05', value: 55 },
      { t: '05:40', value: 82 },
      { t: '06:12', value: 88 },
    ],
    concernIndex: 3,
    transcript: [
      {
        time: '00:14',
        speaker: 'EMP',
        parts: [
          {
            text: 'Hi Ravi, thanks for taking the time. I wanted to walk you through the new enterprise features we discussed last week.',
          },
        ],
      },
      {
        time: '00:45',
        speaker: 'CUST',
        parts: [
          {
            text: 'Yes, I saw the brief. The automation features look exactly like what our team needs right now. ',
          },
          { text: 'We are definitely looking to upgrade our current setup.', tone: 'signal' },
        ],
      },
      {
        time: '02:10',
        speaker: 'EMP',
        parts: [
          {
            text: "That's great to hear. The enterprise tier includes all the custom API integrations which should streamline your workflow significantly.",
          },
        ],
      },
      {
        time: '03:22',
        speaker: 'CUST',
        parts: [
          { text: 'Right. However, ' },
          {
            text: 'I am concerned about the jump in cost. The pricing seems quite steep compared to our current plan.',
            tone: 'objection',
          },
          { text: ' Is there any room for negotiation there?' },
        ],
      },
      {
        time: '04:05',
        speaker: 'EMP',
        parts: [
          {
            text: "I understand the concern, Ravi. The ROI on the automation usually covers the difference within the first quarter, but I can definitely put together a detailed proposal outlining the exact costs and potential savings.",
          },
        ],
      },
      {
        time: '05:40',
        speaker: 'CUST',
        parts: [
          { text: 'Okay, that sounds fair. ' },
          {
            text: 'Please send over that proposal and we can review it internally.',
            tone: 'signal',
          },
          { text: " Let's touch base next week." },
        ],
      },
    ],
  },
  'C-1023': {
    callId: 'C-1023',
    leadName: 'David Chen',
    company: 'Wayne Ent.',
    status: 'Completed',
    completedAt: '21 Aug 2026, 10:18 AM',
    duration: '14:22',
    employee: 'David Chen',
    aiScore: 92,
    sentimentLabel: 'Positive',
    outcome: 'Meeting Booked',
    summary:
      'Customer confirmed budget and authority, and agreed to a follow-up meeting with their technical team to scope the rollout.',
    keyRecommendation: 'Send calendar invite for the technical scoping call within 24 hours',
    signals: [
      { icon: 'cart', label: 'Buying Intent', value: 'High' },
      { icon: 'smiley', label: 'Positive Sentiment', value: '85%' },
      { icon: 'flag', label: 'Meeting Request', value: 'Detected' },
    ],
    talkTime: { emp: 40, cust: 60 },
    questions: 11,
    objections: 0,
    signalsCount: 4,
    followUpRequired: true,
    scoreBreakdown: [
      { label: 'Engagement', value: 93 },
      { label: 'Intent', value: 95 },
      { label: 'Communication', value: 89 },
      { label: 'Outcome Prob.', value: 90 },
    ],
    sentimentArc: [
      { t: '00:00', value: 70 },
      { t: '03:00', value: 78 },
      { t: '07:00', value: 84 },
      { t: '10:30', value: 88 },
      { t: '14:22', value: 92 },
    ],
    concernIndex: -1,
    transcript: [
      {
        time: '00:20',
        speaker: 'EMP',
        parts: [{ text: 'Thanks for making time, David. Where are you in the evaluation process?' }],
      },
      {
        time: '01:05',
        speaker: 'CUST',
        parts: [
          { text: "We've narrowed it down and " },
          { text: 'budget is approved for this quarter.', tone: 'signal' },
        ],
      },
      {
        time: '06:40',
        speaker: 'CUST',
        parts: [
          { text: "Let's get our engineering team on a call to talk rollout." },
        ],
      },
    ],
  },
  'C-1022': {
    callId: 'C-1022',
    leadName: 'Sarah Jenkins',
    company: 'Oscorp',
    status: 'Completed',
    completedAt: '21 Aug 2026, 10:05 AM',
    duration: '05:11',
    employee: 'Sarah Jenkins',
    aiScore: 48,
    sentimentLabel: 'Negative',
    outcome: 'Follow Up Required',
    summary:
      'Customer raised repeated concerns about implementation timeline and integration complexity. No commitment reached; requires a follow-up with technical reassurance.',
    keyRecommendation: 'Loop in a solutions engineer for the follow-up call',
    signals: [
      { icon: 'objection', label: 'Timeline Objection', value: 'Detected' },
      { icon: 'objection', label: 'Integration Concern', value: 'Detected' },
      { icon: 'flag', label: 'Follow-up Request', value: 'Detected' },
    ],
    talkTime: { emp: 58, cust: 42 },
    questions: 4,
    objections: 3,
    signalsCount: 3,
    followUpRequired: true,
    scoreBreakdown: [
      { label: 'Engagement', value: 52 },
      { label: 'Intent', value: 40 },
      { label: 'Communication', value: 61 },
      { label: 'Outcome Prob.', value: 35 },
    ],
    sentimentArc: [
      { t: '00:00', value: 55 },
      { t: '01:30', value: 48 },
      { t: '03:00', value: 30 },
      { t: '05:11', value: 34 },
    ],
    concernIndex: 2,
    transcript: [
      {
        time: '00:18',
        speaker: 'CUST',
        parts: [
          { text: "I'll be honest, " },
          { text: 'our last integration project ran months over schedule.', tone: 'objection' },
        ],
      },
      {
        time: '02:45',
        speaker: 'EMP',
        parts: [
          { text: 'I hear you - let me bring in someone from our solutions team to walk through the timeline in detail.' },
        ],
      },
    ],
  },
}

export function getCallDetail(callId: string): CallDetail | undefined {
  return callDetails[callId]
}
