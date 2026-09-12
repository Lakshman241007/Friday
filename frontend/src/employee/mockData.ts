// Static mock data for /employee. Same pattern as the manager dashboard -
// no backend endpoint exists for a personal employee view yet.

export const currentEmployee = {
  name: 'Priya Sharma',
  role: 'Sales Executive',
}

export interface EmployeeStat {
  label: string
  value: string
  trend: string
  accent: 'default' | 'orange' | 'dark'
}

export const employeeStats: EmployeeStat[] = [
  { label: 'Total Calls', value: '42', trend: '+12%', accent: 'default' },
  { label: 'Conversion', value: '8.4%', trend: '+0.5%', accent: 'orange' },
  { label: 'Talk Time', value: '3.2h', trend: '+8%', accent: 'dark' },
]

export interface WeeklyActivityPoint {
  day: string
  calls: number
  highlighted?: boolean
}

export const weeklyActivity: WeeklyActivityPoint[] = [
  { day: 'M', calls: 5 },
  { day: 'T', calls: 7 },
  { day: 'W', calls: 4 },
  { day: 'T', calls: 9, highlighted: true },
  { day: 'F', calls: 6 },
  { day: 'S', calls: 8 },
  { day: 'S', calls: 10 },
]

export const employeeInsight = {
  title: 'High-priority lead identified',
  body: 'Sarah Jenkins has visited the pricing page 3 times today. High intent score detected.',
  cta: 'Review Lead',
}

export type LeadPriority = 'High Priority' | 'Medium'
export type LeadStatus = 'Active' | 'Pending'

export interface EmployeeLead {
  name: string
  company: string
  maskedPhone: string
  priority: LeadPriority
  status: LeadStatus
  action: 'Schedule' | 'Follow Up'
}

export const employeeLeads: EmployeeLead[] = [
  {
    name: 'Sarah Jenkins',
    company: 'TechFlow Inc.',
    maskedPhone: '•••• 1098',
    priority: 'High Priority',
    status: 'Active',
    action: 'Schedule',
  },
  {
    name: 'Mike Ross',
    company: 'GlobalLogistics',
    maskedPhone: '•••• 8901',
    priority: 'Medium',
    status: 'Pending',
    action: 'Follow Up',
  },
]
