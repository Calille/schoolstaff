'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { RequestActions } from '@/components/request-actions'
import { toast } from 'sonner'

interface Request {
  id: string
  school_id: string
  staff_id: string
  status: string
  created_at: string
  notes: string | null
  weekdays: string[] | null
  batch_id: string | null
  school: {
    id: string
    school_name: string
  }
}

interface GroupedRequest {
  batch_id: string | null
  requests: Request[]
  school_name: string
}

export default function StaffRequestsPage() {
  const [groupedRequests, setGroupedRequests] = useState<GroupedRequest[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null

    const setupSubscription = async () => {
      await loadRequests()

      // Subscribe to real-time updates
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        channel = supabase
          .channel('staff-requests')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'staff_requests',
              filter: `staff_id=eq.${user.id}`,
            },
            (payload) => {
              if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                toast.info('Request updated')
                loadRequests()
              } else if (payload.eventType === 'DELETE') {
                loadRequests()
              }
            }
          )
          .subscribe()
      }
    }

    setupSubscription()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [supabase])

  const loadRequests = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data, error } = await supabase
      .from('staff_requests')
      .select(`
        *,
        school:schools (
          id,
          school_name
        )
      `)
      .eq('staff_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching requests:', error)
      toast.error('Failed to load requests')
    } else {
      // Group requests by batch_id
      const grouped = new Map<string | null, Request[]>()
      
      ;(data || []).forEach((request) => {
        const batchId = request.batch_id || 'individual'
        if (!grouped.has(batchId)) {
          grouped.set(batchId, [])
        }
        grouped.get(batchId)!.push(request)
      })

      // Convert to array format
      const groupedArray: GroupedRequest[] = Array.from(grouped.entries()).map(
        ([batchId, requests]) => {
          const schoolData = Array.isArray(requests[0].school)
            ? requests[0].school[0]
            : requests[0].school

          return {
            batch_id: batchId === 'individual' ? null : batchId,
            requests,
            school_name: schoolData?.school_name || 'Unknown School',
          }
        }
      )

      setGroupedRequests(groupedArray)
    }
    setLoading(false)
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      pending: 'secondary',
      accepted: 'default',
      declined: 'destructive',
    }

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Requests</h1>
        <Card className="p-12 text-center">
          <p className="text-gray-600">Loading...</p>
        </Card>
      </div>
    )
  }

  const totalRequests = groupedRequests.reduce((sum, group) => sum + group.requests.length, 0)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Requests</h1>
        <p className="text-gray-600">
          View and manage booking requests from schools
        </p>
      </div>

      {totalRequests === 0 ? (
        <Card className="p-12 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">No requests yet</p>
          <p className="text-sm text-gray-500">
            Schools will be able to request your services here
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {groupedRequests.map((group, groupIndex) => (
            <Card key={group.batch_id || `individual-${groupIndex}`} className="p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {group.school_name}
                </h2>
                {group.batch_id && (
                  <p className="text-sm text-gray-600 mt-1">
                    Batch Request ({group.requests.length} staff member
                    {group.requests.length !== 1 ? 's' : ''})
                  </p>
                )}
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Required Days</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date Requested</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.requests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{formatWeekdays(request.weekdays)}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>{formatDate(request.created_at)}</TableCell>
                      <TableCell className="text-right">
                        {request.status === 'pending' ? (
                          <RequestActions requestId={request.id} />
                        ) : (
                          <span className="text-sm text-gray-400">No actions</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
