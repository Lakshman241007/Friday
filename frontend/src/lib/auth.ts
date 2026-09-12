// Hardcoded demo credentials. There's no real auth backend yet (see
// docs/phase-plan.md "Auth/permissions model ... still open") - this is a
// placeholder gate for the manager dashboard, not a security boundary.
const DEMO_EMAIL = 'demo@gmail.com'
const DEMO_PASSWORD = 'democall'
const SESSION_KEY = 'friday_manager_session'

export function checkDemoCredentials(email: string, password: string): boolean {
  return email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD
}

export function startManagerSession(): void {
  sessionStorage.setItem(SESSION_KEY, '1')
}

export function endManagerSession(): void {
  sessionStorage.removeItem(SESSION_KEY)
}

export function hasManagerSession(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === '1'
}
