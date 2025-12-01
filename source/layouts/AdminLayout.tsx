import { Outlet } from 'react-router-dom'
import { AdminNav } from '@/components/admin/AdminNav'
import { useAuth } from '@/contexts/AuthContext'
import { Navigate } from 'react-router-dom'

export function AdminLayout() {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Chargement...</div>
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminNav />
      <div className="flex-1 overflow-auto p-6">
        <Outlet />
      </div>
    </div>
  )
}
