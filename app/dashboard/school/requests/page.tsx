'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { Calendar } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { toast } from 'sonner'
import Link from 'next/link'

interface Request {
  id: string
  staff_id: string
  status: string
  created_at: string
  notes: string | null
  weekdays: string[] | null
  batch_id: string | null
  staff: {
    id: string
    profiles: {
      full_name: string
    }
  }
}

interface Batch {
  id: string
  status: string
  created_at: string
  notes: string | null
}

export default function SchoolRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([])
  const [batches, setBatches] = useState<Batch[]>([])
  const [loading, setLoading] = useState(true)
  const [schoolId, setSchoolId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    loadSchoolId()
  }, [])

  useEffect(() => {
    if (schoolId) {
      loadRequests()
      loadBatches()

      // Subscribe to real-time updates
      const channel = supabase
        .channel('school-requests')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'staff_requests',
            filter: `school_id=eq.${schoolId}`,
          },
          () => {
            loadRequests()
            loadBatches()
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'staff_request_batches',
            filter: `school_id=eq.${schoolId}`,
          },
          () => {
            loadBatches()
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [schoolId, supabase])

  const loadSchoolId = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'school') {
      const { data: school } = await supabase
        .from('schools')
        .select('id')
        .eq('profile_id', user.id)
        .single()

      if (school) {
        setSchoolId(school.id)
      }
    }
  }

  const loadRequests = async () => {
    if (!schoolId) return

    const { data, error } = await supabase
      .from('staff_requests')
      .select(`
        *,
        staff:staff_profiles (
          id,
          profiles (
            full_name
          )
        )
      `)
      .eq('school_id', schoolId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching requests:', error)
      toast.error('Failed to load requests')
    } else {
      setRequests(data || [])
    }
    setLoading(false)
  }

  const loadBatches = async () => {
    if (!schoolId) return

    const { data, error } = await supabase
      .from('staff_request_batches')
      .select('*')
      .eq('school_id', schoolId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching batches:', error)
    } else {
      setBatches(data || [])
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      pending: 'secondary',
      accepted: 'default',
      declined: 'destructive',
      confirmed: 'default',
      partially_confirmed: 'secondary',
      cancelled: 'destructive',
    }

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
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

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Request History</h1>
        <Card className="p-12 text-center">
          <p className="text-gray-600">Loading...</p>
        </Card>
      </div>
    )
  }

  const confirmedRequests = requests.filter((r) => r.status === 'accepted')
  const pendingRequests = requests.filter((r) => r.status === 'pending')

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Request History</h1>
        <p className="text-gray-600">
          View all your staff booking requests and batches
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Requests</p>
            <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
          </div>
        </Card>
        <Card className="p-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Confirmed</p>
            <p className="text-2xl font-bold text-gray-900">{confirmedRequests.length}</p>
          </div>
        </Card>
        <Card className="p-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Pending</p>
            <p className="text-2xl font-bold text-gray-900">{pendingRequests.length}</p>
          </div>
        </Card>
      </div>

      {/* Batches */}
      {batches.length > 0 && (
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Batches</h2>
          <div className="space-y-3">
            {batches.map((batch) => {
              const batchRequests = requests.filter((r) => r.batch_id === batch.id)
              return (
                <Link
                  key={batch.id}
                  href={`/dashboard/school/requests/batch/${batch.id}`}
                  className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">
                          Batch {batch.id.slice(0, 8)}...
                        </span>
                        {getStatusBadge(batch.status)}
                      </div>
                      <p className="text-sm text-gray-600">
                        {batchRequests.length} request{batchRequests.length !== 1 ? 's' : ''} •{' '}
                        {formatDate(batch.created_at)}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </Card>
      )}

      {/* Individual Requests */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          All Requests ({requests.length})
        </h2>
        {requests.length === 0 ? (
          <p className="text-gray-600">No requests yet</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Member</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Required Days</TableHead>
                <TableHead>Date Requested</TableHead>
                <TableHead>Batch</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => {
                const staffData = Array.isArray(request.staff)
                  ? request.staff[0]
                  : request.staff

                const staffProfile = Array.isArray(staffData?.profiles)
                  ? staffData?.profiles[0]
                  : staffData?.profiles

                return (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">
                      {staffProfile?.full_name || 'Unknown Staff'}
                    </TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>{formatWeekdays(request.weekdays)}</TableCell>
                    <TableCell>{formatDate(request.created_at)}</TableCell>
                    <TableCell>
                      {request.batch_id ? (
                        <Link
                          href={`/dashboard/school/requests/batch/${request.batch_id}`}
                          className="text-sm text-gray-600 hover:text-gray-900 underline"
                        >
                          View Batch
                        </Link>
                      ) : (
                        <span className="text-sm text-gray-400">Individual</span>
                      )}
                    </TableCell>
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
