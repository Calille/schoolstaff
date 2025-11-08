'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { ShoppingCart, X, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface CartItem {
  id: string
  staff_id: string
  weekdays: string[] | null
  staff: {
    profiles: {
      full_name: string
    }
  }
}

export default function RequestCartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [notes, setNotes] = useState('')
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null

    const setupSubscription = async () => {
      await loadCart()

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

        if (school?.id) {
          channel = supabase
            .channel('request-cart')
            .on(
              'postgres_changes',
              {
                event: '*',
                schema: 'public',
                table: 'staff_requests',
                filter: `school_id=eq.${school.id}`,
              },
              () => {
                loadCart()
              }
            )
            .subscribe()
        }
      }
    }

    setupSubscription()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [supabase])

  const loadCart = async () => {
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
      .eq('school_id', school.id)
      .is('batch_id', null)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading cart:', error)
      toast.error('Failed to load cart')
    } else {
      setCartItems(data || [])
    }
    setLoading(false)
  }

  const removeFromCart = async (requestId: string) => {
    try {
      const response = await fetch(`/api/staff/remove-from-cart?request_id=${requestId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to remove from cart')
      }

      toast.success('Removed from cart')
      loadCart()
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove from cart')
    }
  }

  const submitBatch = async () => {
    if (cartItems.length === 0) {
      toast.error('Cart is empty')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/batches/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit batch')
      }

      toast.success('Request batch submitted successfully')
      router.push(`/dashboard/school/requests/batch/${data.batch_id}`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit batch')
      setSubmitting(false)
    }
  }

  const formatWeekdays = (weekdays: string[] | null) => {
    if (!weekdays || weekdays.length === 0) return 'Not specified'
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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Request Cart</h1>
        <Card className="p-12 text-center">
          <p className="text-gray-600">Loading...</p>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Request Cart</h1>
        <p className="text-gray-600">
          Review your staff requests before submitting
        </p>
      </div>

      {cartItems.length === 0 ? (
        <Card className="p-12 text-center">
          <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Your cart is empty</p>
          <p className="text-sm text-gray-500">
            Add staff members from the staff listing page
          </p>
        </Card>
      ) : (
        <>
          <Card className="p-6 mb-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff Member</TableHead>
                  <TableHead>Required Days</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cartItems.map((item) => {
                  const staffData = Array.isArray(item.staff)
                    ? item.staff[0]
                    : item.staff
                  const staffProfile = Array.isArray(staffData?.profiles)
                    ? staffData?.profiles[0]
                    : staffData?.profiles

                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {staffProfile?.full_name || 'Unknown Staff'}
                      </TableCell>
                      <TableCell>{formatWeekdays(item.weekdays)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </Card>

          <Card className="p-6 mb-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="notes">Batch Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about this batch of requests..."
                  rows={4}
                  className="mt-1"
                />
              </div>
            </div>
          </Card>

          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">
                {cartItems.length} staff member{cartItems.length !== 1 ? 's' : ''} in cart
              </p>
            </div>
            <Button
              onClick={submitBatch}
              disabled={submitting}
              size="lg"
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              {submitting ? 'Submitting...' : 'Submit Request Batch'}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

