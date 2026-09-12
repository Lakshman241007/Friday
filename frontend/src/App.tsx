import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import { ProtectedRoute } from './components/ProtectedRoute'
import { DashboardLayout } from './dashboard/layout/DashboardLayout'
import Overview from './dashboard/pages/Overview'
import LeadManagement from './dashboard/pages/LeadManagement'
import CallMonitoring from './dashboard/pages/CallMonitoring'
import CallDetails from './dashboard/pages/CallDetails'
import FollowUps from './dashboard/pages/FollowUps'
import { PlaceholderPage } from './dashboard/pages/PlaceholderPage'
import EmployeeDashboard from './employee/pages/EmployeeDashboard'
import UploadCall from './employee/pages/UploadCall'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/employee" element={<EmployeeDashboard />} />
      <Route path="/employee/upload" element={<UploadCall />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path="leads" element={<LeadManagement />} />
        <Route path="calls" element={<CallMonitoring />} />
        <Route path="calls/:callId" element={<CallDetails />} />
        <Route path="performance" element={<PlaceholderPage title="Performance" />} />
        <Route path="follow-ups" element={<FollowUps />} />
      </Route>
    </Routes>
  )
}
