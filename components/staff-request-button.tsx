'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { WeekdaySelectorDialog } from './weekday-selector-dialog'
import { ShoppingCart } from 'lucide-react'

interface StaffRequestButtonProps {
  staffId: string
  schoolId: string
  requestedDate?: string
  requestedStartTime?: string
  requestedEndTime?: string
}

export function StaffRequestButton({
  staffId,
  schoolId,
  requestedDate,
  requestedStartTime,
  requestedEndTime,
}: StaffRequestButtonProps) {
  const [loading, setLoading] = useState(false)
  const [showDialog, setShowDialog] = useState(false)

  const handleAddToCart = async (weekdays: string[]) => {
    if (!schoolId) {
      toast.error('School profile not found')
      return
    }

    setLoading(true)

    try {
      // Check for conflicts if date/time provided
      if (requestedDate) {
        const checkResponse = await fetch('/api/staff/request-check', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            staff_id: staffId,
            date: requestedDate,
            start_time: requestedStartTime,
            end_time: requestedEndTime,
          }),
        })

        const checkData = await checkResponse.json()

        if (!checkData.ok && checkData.conflicts.length > 0) {
          const conflictMessages = checkData.conflicts
            .map((c: any) => c.message)
            .join(', ')
          toast.warning(`Availability conflicts detected: ${conflictMessages}`)
          // Still allow adding to cart but warn user
        }
      }

      const response = await fetch('/api/staff/add-to-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          staff_id: staffId,
          weekdays: weekdays,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add to cart')
      }

      toast.success('Added to Request Cart')
    } catch (error: any) {
      toast.error(error.message || 'Failed to add to cart')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        onClick={() => setShowDialog(true)}
        disabled={loading || !schoolId}
        className="w-full"
        size="sm"
        variant="outline"
      >
        <ShoppingCart className="h-4 w-4 mr-2" />
        {loading ? 'Adding...' : 'Add to Request Cart'}
      </Button>

      <WeekdaySelectorDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        onConfirm={handleAddToCart}
      />
    </>
  )
}
