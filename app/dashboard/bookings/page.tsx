import { Card } from '@/components/ui/card'
import { requireRole } from '@/lib/auth'

export default async function BookingsPage() {
  await requireRole('school')

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Bookings</h1>
      <Card className="p-6">
        <p className="text-gray-600 mb-4">
          Booking list will be displayed here.
        </p>
        <p className="text-sm text-gray-500">
          You'll be able to see all your bookings, their status, and manage them from this page.
        </p>
      </Card>
    </div>
  )
}

