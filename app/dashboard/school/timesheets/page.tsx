'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { CheckCircle, XCircle } from 'lucide-react'

interface Timesheet {
  id: string
  staff_id: string
  date: string
  start_time: string
  end_time: string
  break_minutes: number
  total_hours: number
  hourly_rate: number
  amount: number
  status: string
  notes: string | null
  staff: {
    profiles: {
      full_name: string
    }
  }
}

export default function SchoolTimesheetsPage() {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [reviewingId, setReviewingId] = useState<string | null>(null)
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(null)
  const [reviewComment, setReviewComment] = useState('')
  const [processing, setProcessing] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadTimesheets()

    // Subscribe to real-time updates
    const channel = supabase
      .channel('school-timesheets')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'timesheets',
        },
        () => {
          loadTimesheets()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, filter])

  const loadTimesheets = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'school') return

    const { data: school } = await supabase
      .from('schools')
      .select('id')
      .eq('profile_id', user.id)
      .single()

    if (!school) return

    let query = supabase
      .from('timesheets')
      .select(`
        *,
        staff:staff_profiles (
          profiles (
            full_name
          )
        )
      `)
      .eq('school_id', school.id)

    if (filter === 'pending') {
      query = query.eq('status', 'submitted')
    } else if (filter === 'approved') {
      query = query.eq('status', 'approved_by_school')
    } else if (filter === 'rejected') {
      query = query.eq('status', 'rejected')
    }

    const { data, error } = await query.order('date', { ascending: false })

    if (error) {
      console.error('Error loading timesheets:', error)
      toast.error('Failed to load timesheets')
    } else {
      setTimesheets(data || [])
    }
    setLoading(false)
  }

  const handleReview = async () => {
    if (!reviewingId || !reviewAction) return

    setProcessing(true)

    try {
      const response = await fetch('/api/timesheets/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timesheet_id: reviewingId,
          action: reviewAction,
          comment: reviewComment || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to review timesheet')
      }

      toast.success(`Timesheet ${reviewAction === 'approve' ? 'approved' : 'rejected'}`)
      setReviewingId(null)
      setReviewAction(null)
      setReviewComment('')
      loadTimesheets()
    } catch (error: any) {
      toast.error(error.message || 'Failed to review timesheet')
    } finally {
      setProcessing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      submitted: 'secondary',
      approved_by_school: 'default',
      rejected: 'destructive',
      processed_for_payroll: 'default',
    }

    const labels: Record<string, string> = {
      submitted: 'Pending',
      approved_by_school: 'Approved',
      rejected: 'Rejected',
      processed_for_payroll: 'Processed',
    }

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {labels[status] || status}
      </Badge>
    )
  }

  const pendingTimesheets = timesheets.filter((t) => t.status === 'submitted')

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Timesheets</h1>
        <p className="text-gray-600">Review and approve staff timesheets</p>
      </div>

      <Card className="p-6 mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('pending')}
          >
            Pending ({pendingTimesheets.length})
          </Button>
          <Button
            variant={filter === 'approved' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('approved')}
          >
            Approved
          </Button>
          <Button
            variant={filter === 'rejected' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('rejected')}
          >
            Rejected
          </Button>
        </div>
      </Card>

      {loading ? (
        <Card className="p-12 text-center">
          <p className="text-gray-600">Loading...</p>
        </Card>
      ) : (
        <Card className="p-6">
          {timesheets.length === 0 ? (
            <p className="text-gray-600">No timesheets found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {timesheets.map((timesheet) => {
                  const staffData = Array.isArray(timesheet.staff)
                    ? timesheet.staff[0]
                    : timesheet.staff

                  const staffProfile = staffData?.profiles
                    ? Array.isArray(staffData.profiles)
                      ? staffData.profiles[0]
                      : staffData.profiles
                    : null

                  return (
                    <TableRow key={timesheet.id}>
                      <TableCell>
                        {timesheet.date ? new Date(timesheet.date).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>{staffProfile?.full_name || 'Unknown'}</TableCell>
                      <TableCell>
                        {timesheet.start_time && timesheet.end_time
                          ? `${timesheet.start_time} - ${timesheet.end_time}`
                          : '-'}
                      </TableCell>
                      <TableCell>
                        {timesheet.total_hours
                          ? Number(timesheet.total_hours).toFixed(2)
                          : '0.00'}
                      </TableCell>
                      <TableCell>
                        £{timesheet.amount ? Number(timesheet.amount).toFixed(2) : '0.00'}
                      </TableCell>
                      <TableCell>{getStatusBadge(timesheet.status)}</TableCell>
                      <TableCell className="text-right">
                        {timesheet.status === 'submitted' && (
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setReviewingId(timesheet.id)
                                setReviewAction('approve')
                              }}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                setReviewingId(timesheet.id)
                                setReviewAction('reject')
                              }}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </Card>
      )}

      <Dialog open={!!reviewingId} onOpenChange={(open) => !open && setReviewingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === 'approve' ? 'Approve' : 'Reject'} Timesheet
            </DialogTitle>
            <DialogDescription>
              {reviewAction === 'reject'
                ? 'Please provide a reason for rejection'
                : 'Add an optional comment'}
            </DialogDescription>
          </DialogHeader>

          <div>
            <Label htmlFor="comment">Comment {reviewAction === 'reject' ? '*' : '(Optional)'}</Label>
            <Textarea
              id="comment"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="mt-1"
              rows={3}
              required={reviewAction === 'reject'}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewingId(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleReview}
              disabled={processing || (reviewAction === 'reject' && !reviewComment)}
              variant={reviewAction === 'reject' ? 'destructive' : 'default'}
            >
              {processing
                ? 'Processing...'
                : `${reviewAction === 'approve' ? 'Approve' : 'Reject'}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
