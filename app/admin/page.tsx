'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { FileText, AlertCircle, CheckCircle } from 'lucide-react'

interface KPIData {
  openRequests: number
  partiallyFilledBatches: number
  todaysFilledPlacements: number
}

export default function AdminDashboard() {
  const [kpis, setKpis] = useState<KPIData>({
    openRequests: 0,
    partiallyFilledBatches: 0,
    todaysFilledPlacements: 0,
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadKPIs()

    // Subscribe to real-time updates
    const channel = supabase
      .channel('admin-dashboard')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'staff_requests',
        },
        () => {
          loadKPIs()
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'staff_request_batches',
        },
        () => {
          loadKPIs()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const loadKPIs = async () => {
    try {
      // Open Requests (pending)
      const { count: openRequests } = await supabase
        .from('staff_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

      // Partially Filled Batches
      const { count: partiallyFilledBatches } = await supabase
        .from('staff_request_batches')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'partially_confirmed')

      // Today's Filled Placements
      const today = new Date()
      const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
      const todayWeekday = dayNames[today.getDay()]

      const { count: todaysFilledPlacements } = await supabase
        .from('staff_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'accepted')
        .contains('weekdays', [todayWeekday])

      setKpis({
        openRequests: openRequests || 0,
        partiallyFilledBatches: partiallyFilledBatches || 0,
        todaysFilledPlacements: todaysFilledPlacements || 0,
      })
    } catch (error) {
      console.error('Error loading KPIs:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Operations Dashboard</h1>
        <p className="text-gray-600">Monitor and manage staffing requests</p>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-gray-600 mr-2" />
                <h3 className="text-sm font-medium text-gray-600">Open Requests</h3>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">{kpis.openRequests}</div>
            <p className="text-xs text-gray-500 mt-2">Pending assignment</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-gray-600 mr-2" />
                <h3 className="text-sm font-medium text-gray-600">Partially Filled Batches</h3>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {kpis.partiallyFilledBatches}
            </div>
            <p className="text-xs text-gray-500 mt-2">Requires attention</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-gray-600 mr-2" />
                <h3 className="text-sm font-medium text-gray-600">Today's Filled Placements</h3>
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {kpis.todaysFilledPlacements}
            </div>
            <p className="text-xs text-gray-500 mt-2">Confirmed for today</p>
          </Card>
        </div>
      )}
    </div>
  )
}
