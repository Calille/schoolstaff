import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Clock } from 'lucide-react'

export default async function StaffTimesheetsPage() {
  const profile = await requireRole('staff')
  const supabase = await createClient()

  const { data: timesheets, error } = await supabase
    .from('timesheets')
    .select(`
      *,
      school:schools (
        school_name
      )
    `)
    .eq('staff_id', profile.id)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      submitted: 'secondary',
      approved_by_school: 'default',
      rejected: 'destructive',
      processed_for_payroll: 'default',
    }

    const labels: Record<string, string> = {
      submitted: 'Submitted',
      approved_by_school: 'Approved',
      rejected: 'Rejected',
      processed_for_payroll: 'Processed',
    }

    const colors: Record<string, string> = {
      submitted: 'bg-gray-500',
      approved_by_school: 'bg-green-600',
      rejected: 'bg-red-600',
      processed_for_payroll: 'bg-primary-600',
    }

    return (
      <Badge
        variant={variants[status as keyof typeof variants] || 'secondary'}
        className={colors[status] || ''}
      >
        {labels[status] || status}
      </Badge>
    )
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Timesheets</h1>
          <p className="text-gray-600">Submit and track your timesheets</p>
        </div>
        <Link href="/dashboard/staff/timesheets/new">
          <Button>
            <Clock className="h-4 w-4 mr-2" />
            Submit Timesheet
          </Button>
        </Link>
      </div>

      <Card className="p-6">
        {error ? (
          <p className="text-red-600">Error loading timesheets: {error.message}</p>
        ) : !timesheets || timesheets.length === 0 ? (
          <p className="text-gray-600">No timesheets submitted yet</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>School</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timesheets.map((timesheet) => {
                const schoolData = Array.isArray(timesheet.school)
                  ? timesheet.school[0]
                  : timesheet.school

                return (
                  <TableRow key={timesheet.id}>
                    <TableCell>
                      {timesheet.date ? new Date(timesheet.date).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>{schoolData?.school_name || 'Unknown'}</TableCell>
                    <TableCell>
                      {timesheet.start_time && timesheet.end_time
                        ? `${timesheet.start_time} - ${timesheet.end_time}`
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {timesheet.total_hours ? Number(timesheet.total_hours).toFixed(2) : '0.00'}
                    </TableCell>
                    <TableCell>
                      £{timesheet.amount ? Number(timesheet.amount).toFixed(2) : '0.00'}
                    </TableCell>
                    <TableCell>{getStatusBadge(timesheet.status)}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}
