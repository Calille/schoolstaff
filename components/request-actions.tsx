'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface RequestActionsProps {
  requestId: string
}

export function RequestActions({ requestId }: RequestActionsProps) {
  const [loading, setLoading] = useState<'accept' | 'decline' | null>(null)

  const handleAction = async (action: 'accept' | 'decline') => {
    setLoading(action)

    try {
      const response = await fetch('/api/staff/requests/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          request_id: requestId,
          status: action === 'accept' ? 'accepted' : 'declined',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update request')
      }

      toast.success(`Request ${action === 'accept' ? 'accepted' : 'declined'}`)
      
      // Refresh the page to show updated status
      window.location.reload()
    } catch (error: any) {
      toast.error(error.message || 'Failed to update request')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex gap-2 justify-end">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleAction('decline')}
        disabled={loading !== null}
      >
        {loading === 'decline' ? 'Declining...' : 'Decline'}
      </Button>
      <Button
        size="sm"
        onClick={() => handleAction('accept')}
        disabled={loading !== null}
      >
        {loading === 'accept' ? 'Accepting...' : 'Accept'}
      </Button>
    </div>
  )
}

