'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { Download, Printer } from 'lucide-react'

interface DailyPlacement {
  school_name: string
  staff_name: string
  status: string
  weekdays: string[] | null
  notes: string | null
}

export default function DailySheetPage() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })
  const [placements, setPlacements] = useState<DailyPlacement[]>([])
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadPlacements()
  }, [selectedDate])

  const loadPlacements = async () => {
    setLoading(true)
    try {
      const date = new Date(selectedDate)
      const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
      const weekday = dayNames[date.getDay()]

      // Get all accepted requests for this weekday
      const { data, error } = await supabase
        .from('staff_requests')
        .select(`
          status,
          weekdays,
          notes,
          school:schools (
            school_name
          ),
          staff:staff_profiles (
            profiles (
              full_name
            )
          )
        `)
        .eq('status', 'accepted')
        .contains('weekdays', [weekday])

      if (error) {
        console.error('Error loading placements:', error)
      } else {
        const formatted: DailyPlacement[] = (data || []).map((req) => {
          const schoolData = Array.isArray(req.school)
            ? req.school[0]
            : req.school

          const staffData = req.staff
            ? Array.isArray(req.staff)
              ? req.staff[0]
              : req.staff
            : null

          const staffProfile = staffData?.profiles
            ? Array.isArray(staffData.profiles)
              ? staffData.profiles[0]
              : staffData.profiles
            : null

          return {
            school_name: schoolData?.school_name || 'Unknown School',
            staff_name: staffProfile?.full_name || 'Unknown Staff',
            status: req.status,
            weekdays: req.weekdays,
            notes: req.notes,
          }
        })

        // Group by school
        const grouped = new Map<string, DailyPlacement[]>()
        formatted.forEach((p) => {
          if (!grouped.has(p.school_name)) {
            grouped.set(p.school_name, [])
          }
          grouped.get(p.school_name)!.push(p)
        })

        // Flatten and sort
        const sorted: DailyPlacement[] = []
        Array.from(grouped.entries())
          .sort(([a], [b]) => a.localeCompare(b))
          .forEach(([_, placements]) => {
            placements.sort((a, b) => a.staff_name.localeCompare(b.staff_name))
            sorted.push(...placements)
          })

        setPlacements(sorted)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
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

  const exportCSV = () => {
    const headers = ['School', 'Staff', 'Status', 'Weekdays', 'Notes']
    const rows = placements.map((p) => [
      p.school_name,
      p.staff_name,
      p.status,
      formatWeekdays(p.weekdays),
      p.notes || '',
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `daily-sheet-${selectedDate}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily Staffing Sheet</h1>
        <p className="text-gray-600">View and export daily staffing assignments</p>
      </div>

      <Card className="p-6 mb-6 no-print">
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <Label htmlFor="date">Select Date</Label>
            <Input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button onClick={exportCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download CSV
          </Button>
          <Button onClick={handlePrint} variant="outline">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </Card>

      {loading ? (
        <Card className="p-12 text-center">
          <p className="text-gray-600">Loading...</p>
        </Card>
      ) : (
        <Card className="p-6">
          {placements.length === 0 ? (
            <p className="text-gray-600">No placements for selected date</p>
          ) : (
            <div className="space-y-6">
              {Array.from(
                new Map(
                  placements.map((p) => [p.school_name, p])
                ).entries()
              ).map(([schoolName, firstPlacement]) => {
                const schoolPlacements = placements.filter(
                  (p) => p.school_name === schoolName
                )

                return (
                  <div key={schoolName} className="border-b pb-6 last:border-0">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      {schoolName}
                    </h2>
                    <div className="space-y-3">
                      {schoolPlacements.map((placement, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <span className="font-medium text-gray-900">
                                {placement.staff_name}
                              </span>
                              <Badge variant="default">{placement.status}</Badge>
                              <span className="text-sm text-gray-600">
                                {formatWeekdays(placement.weekdays)}
                              </span>
                            </div>
                            {placement.notes && (
                              <p className="text-sm text-gray-600 mt-1">
                                Notes: {placement.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      )}

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-content,
          .print-content * {
            visibility: visible;
          }
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}

