'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Download } from 'lucide-react'
import { trackPayrollExport } from '@/lib/analytics'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface PayrollExport {
  id: string
  date_from: string
  date_to: string
  exported_at: string
  total_staff: number
  total_amount: number
}

export default function AdminPayrollPage() {
  const [dateFrom, setDateFrom] = useState(() => {
    const date = new Date()
    date.setDate(1) // First day of current month
    return date.toISOString().split('T')[0]
  })
  const [dateTo, setDateTo] = useState(() => {
    const date = new Date()
    return date.toISOString().split('T')[0]
  })
  const [exporting, setExporting] = useState(false)
  const [exports, setExports] = useState<PayrollExport[]>([])

  const handleExport = async () => {
    if (!dateFrom || !dateTo) {
      toast.error('Please select date range')
      return
    }

    if (dateFrom > dateTo) {
      toast.error('Start date must be before end date')
      return
    }

    setExporting(true)

    try {
      const response = await fetch('/api/payroll/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date_from: dateFrom,
          date_to: dateTo,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to export payroll')
      }

      // Download CSV file
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `payroll-${dateFrom}-to-${dateTo}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      // Add to exports list
      setExports([
        {
          id: Date.now().toString(),
          date_from: dateFrom,
          date_to: dateTo,
          exported_at: new Date().toISOString(),
          total_staff: 0, // Would come from server
          total_amount: 0, // Would come from server
        },
        ...exports,
      ])

      trackPayrollExport(true)
      toast.success('Payroll exported successfully')
    } catch (error: any) {
      trackPayrollExport(false)
      toast.error(error.message || 'Failed to export payroll')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payroll Export</h1>
        <p className="text-gray-600">Export payroll data for processing</p>
      </div>

      <Card className="p-6 mb-6">
        <CardHeader>
          <CardTitle>Export Payroll</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Date Range</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date_from">From Date</Label>
                  <Input
                    id="date_from"
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="date_to">To Date</Label>
                  <Input
                    id="date_to"
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Button onClick={handleExport} disabled={exporting} size="lg">
                <Download className="h-4 w-4 mr-2" />
                {exporting ? 'Exporting...' : 'Export Payroll CSV'}
              </Button>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-gray-600">
                The export will include all approved timesheets in the selected date range that
                haven't been processed yet. Timesheets will be marked as processed after export.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {exports.length > 0 && (
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Recent Exports</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date Range</TableHead>
                  <TableHead>Exported At</TableHead>
                  <TableHead>Staff Count</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exports.map((exportRecord) => (
                  <TableRow key={exportRecord.id}>
                    <TableCell>
                      {new Date(exportRecord.date_from).toLocaleDateString()} -{' '}
                      {new Date(exportRecord.date_to).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(exportRecord.exported_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{exportRecord.total_staff}</TableCell>
                    <TableCell>£{exportRecord.total_amount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
