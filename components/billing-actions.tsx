'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface BillingActionsProps {
  hasCustomer: boolean
  requestId?: string
}

export function BillingActions({ hasCustomer, requestId }: BillingActionsProps) {
  const [loading, setLoading] = useState(false)

  const handleCustomerPortal = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/billing/customer-portal', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to open customer portal')
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to open customer portal')
      setLoading(false)
    }
  }

  const handlePayNow = async () => {
    if (!requestId) return

    setLoading(true)
    try {
      const response = await fetch('/api/billing/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ request_id: requestId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      if (data.session_url) {
        window.location.href = data.session_url
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create payment session')
      setLoading(false)
    }
  }

  if (requestId) {
    return (
      <Button onClick={handlePayNow} disabled={loading} size="sm">
        {loading ? 'Loading...' : 'Pay Now'}
      </Button>
    )
  }

  return (
    <Button
      onClick={handleCustomerPortal}
      disabled={loading || !hasCustomer}
      variant="outline"
      size="sm"
    >
      {loading ? 'Loading...' : hasCustomer ? 'Manage Payment' : 'Add Payment Method'}
    </Button>
  )
}

