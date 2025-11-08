import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { requireRole } from '@/lib/auth'

export default async function AdminStaffPage() {
  await requireRole('admin')

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
        <Button>Add Staff Member</Button>
      </div>
      <Card className="p-6">
        <p className="text-gray-600 mb-4">
          Staff list and management interface will be implemented here.
        </p>
        <p className="text-sm text-gray-500">
          You'll be able to view all staff members, add new ones, edit existing profiles, and manage availability.
        </p>
      </Card>
    </div>
  )
}

