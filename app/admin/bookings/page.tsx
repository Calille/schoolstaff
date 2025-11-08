import { Card } from '@/components/ui/card'
import { requireRole } from '@/lib/auth'

export default async function AdminBookingsPage() {
  await requireRole('admin')

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Bookings Management</h1>
      <Card className="p-6">
        <p className="text-gray-600 mb-4">
          Booking management interface will be implemented here.
        </p>
        <p className="text-sm text-gray-500">
          You'll be able to view all bookings, approve requests, assign staff members, and track status.
        </p>
      </Card>
    </div>
  )
}

