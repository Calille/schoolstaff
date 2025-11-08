'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { ArrowLeft, Calendar } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Link from 'next/link'

interface Request {
  id: string
  staff_id: string
  status: string
  weekdays: string[] | null
  created_at: string
  staff: {
    profiles: {
      full_name: string
    }
  }
}

interface Batch {
  id: string
  status: string
  notes: string | null
  created_at: string
}

export default function BatchViewPage() {
  const params = useParams()
  const router = useRouter()
  const batchId = params.id as string
  const [batch, setBatch] = useState<Batch | null>(null)
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    if (batchId) {
      loadBatch()
      loadRequests()

      // Subscribe to real-time updates
      const channel = supabase
        .channel(`batch-${batchId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'staff_requests',
            filter: `batch_id=eq.${batchId}`,
          },
          () => {
            loadRequests()
            loadBatch()
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'staff_request_batches',
            filter: `id=eq.${batchId}`,
          },
          () => {
            loadBatch()
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [batchId, supabase])

  const loadBatch = async () => {
    const { data, error } = await supabase
      .from('staff_request_batches')
      .select('*')
      .eq('id', batchId)
      .single()

    if (error) {
      console.error('Error loading batch:', error)
      toast.error('Failed to load batch')
    } else {
      setBatch(data)
    }
  }

  const loadRequests = async () => {
    const { data, error } = await supabase
      .from('staff_requests')
      .select(`
        *,
        staff:staff_profiles (
          profiles (
            full_name
          )
        )
      `)
      .eq('batch_id', batchId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading requests:', error)
      toast.error('Failed to load requests')
    } else {
      setRequests(data || [])
    }
    setLoading(false)
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
      hour: '2-digit',
      minute: '2-digit',
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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Batch Details</h1>
        <Card className="p-12 text-center">
          <p className="text-gray-600">Loading...</p>
        </Card>
      </div>
    )
  }

  if (!batch) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Batch Not Found</h1>
        <Card className="p-6">
          <p className="text-gray-600">The requested batch could not be found.</p>
          <Link href="/dashboard/school/requests">
            <Button className="mt-4">Back to Requests</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const acceptedCount = requests.filter((r) => r.status === 'accepted').length
  const declinedCount = requests.filter((r) => r.status === 'declined').length
  const pendingCount = requests.filter((r) => r.status === 'pending').length

  return (
    <div>
      <div className="mb-8">
        <Link href="/dashboard/school/requests">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Requests
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Batch Details</h1>
        <p className="text-gray-600">
          Track the status of your staff request batch
        </p>
      </div>

      {/* Batch Info */}
      <Card className="p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Batch Status</p>
            <div className="mb-4">{getStatusBadge(batch.status)}</div>
            <p className="text-sm text-gray-600 mb-1">Created</p>
            <p className="text-sm font-medium text-gray-900">
              {formatDate(batch.created_at)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Summary</p>
            <div className="space-y-1">
              <p className="text-sm">
                <span className="font-medium">{requests.length}</span> total requests
              </p>
              <p className="text-sm">
                <span className="font-medium text-green-600">{acceptedCount}</span> accepted
              </p>
              <p className="text-sm">
                <span className="font-medium text-gray-600">{pendingCount}</span> pending
              </p>
              {declinedCount > 0 && (
                <p className="text-sm">
                  <span className="font-medium text-red-600">{declinedCount}</span> declined
                </p>
              )}
            </div>
          </div>
        </div>
        {batch.notes && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600 mb-1">Notes</p>
            <p className="text-sm text-gray-900">{batch.notes}</p>
          </div>
        )}
      </Card>

      {/* Requests */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Staff Requests ({requests.length})
        </h2>
        {requests.length === 0 ? (
          <p className="text-gray-600">No requests in this batch</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Member</TableHead>
                <TableHead>Required Days</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Requested</TableHead>
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
                    <TableCell>{formatWeekdays(request.weekdays)}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>{formatDate(request.created_at)}</TableCell>
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

