import { Card } from '@/components/ui/card'
import { requireRole } from '@/lib/auth'

export default async function RequestStaffPage() {
  await requireRole('school')

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Request Staff</h1>
      <Card className="p-6">
        <p className="text-gray-600 mb-4">
          Staff request form will be implemented here.
        </p>
        <p className="text-sm text-gray-500">
          This form will allow you to specify dates, times, staff requirements, and other details.
        </p>
      </Card>
    </div>
  )
}

