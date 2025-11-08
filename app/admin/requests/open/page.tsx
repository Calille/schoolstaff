'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { AssignStaffModal } from '@/components/assign-staff-modal'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface OpenRequest {
  id: string
  school_id: string
  staff_id: string | null
  status: string
  weekdays: string[] | null
  created_at: string
  school: {
    school_name: string
  }
  staff: {
    profiles: {
      full_name: string
    }
  } | null
}

export default function OpenRequestsPage() {
  const [requests, setRequests] = useState<OpenRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [assigningRequestId, setAssigningRequestId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    loadRequests()

    // Subscribe to real-time updates
    const channel = supabase
      .channel('admin-open-requests')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'staff_requests',
          filter: "status=eq.pending",
        },
        () => {
          loadRequests()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const loadRequests = async () => {
    const { data, error } = await supabase
      .from('staff_requests')
      .select(`
        *,
        school:schools (
          school_name
        ),
        staff:staff_profiles (
          profiles (
            full_name
          )
        )
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading requests:', error)
    } else {
      setRequests(data || [])
    }
    setLoading(false)
  }

  const formatWeekdays = (weekdays: string[] | null) => {
    if (!weekdays || weekdays.length === 0) return '-'
    const labels: Record<string, string> = {
      mon: 'Mon',
      tue: 'Tue',
      wed: 'Wed',
      thu: 'Thu',
      fri: 'Fri',
    }
    return weekdays.map((w) => labels[w] || w).join(', ')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleAssignComplete = () => {
    setAssigningRequestId(null)
    loadRequests()
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Open Requests</h1>
        <p className="text-gray-600">Pending staff assignments</p>
      </div>

      {loading ? (
        <Card className="p-12 text-center">
          <p className="text-gray-600">Loading...</p>
        </Card>
      ) : (
        <Card className="p-6">
          {requests.length === 0 ? (
            <p className="text-gray-600">No open requests</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>School Name</TableHead>
                  <TableHead>Staff Requested</TableHead>
                  <TableHead>Requested Weekdays</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => {
                  const schoolData = Array.isArray(request.school)
                    ? request.school[0]
                    : request.school

                  const staffData = request.staff
                    ? Array.isArray(request.staff)
                      ? request.staff[0]
                      : request.staff
                    : null

                  const staffProfile = staffData?.profiles
                    ? Array.isArray(staffData.profiles)
                      ? staffData.profiles[0]
                      : staffData.profiles
                    : null

                  return (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {schoolData?.school_name || 'Unknown School'}
                      </TableCell>
                      <TableCell>
                        {staffProfile?.full_name || (
                          <span className="text-gray-400">Not assigned yet</span>
                        )}
                      </TableCell>
                      <TableCell>{formatWeekdays(request.weekdays)}</TableCell>
                      <TableCell>{formatDate(request.created_at)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">Pending</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={() => setAssigningRequestId(request.id)}
                        >
                          Assign
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </Card>
      )}

      {assigningRequestId && (
        <AssignStaffModal
          requestId={assigningRequestId}
          open={!!assigningRequestId}
          onOpenChange={(open) => {
            if (!open) {
              setAssigningRequestId(null)
            }
          }}
          onComplete={handleAssignComplete}
        />
      )}
    </div>
  )
}

