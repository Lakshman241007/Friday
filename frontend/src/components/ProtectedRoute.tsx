import type { ReactElement } from 'react'
import { Navigate } from 'react-router-dom'
import { hasManagerSession } from '../lib/auth'

export function ProtectedRoute({ children }: { children: ReactElement }) {
  if (!hasManagerSession()) {
    return <Navigate to="/login" replace />
  }
  return children
}
