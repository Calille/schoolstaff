'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { FileText, CheckCircle } from 'lucide-react'
import { trackInvoiceGeneration } from '@/lib/analytics'

interface Invoice {
  id: string
  school_id: string
  amount: number
  status: string
  issued_at: string | null
  created_at: string
  stripe_invoice_id: string | null
  school: {
    school_name: string
  }
}

interface InvoiceLine {
  id: string
  invoice_id: string
  timesheet_id: string | null
  description: string | null
  quantity: number
  unit_price: number
  line_total: number
}

export default function AdminInvoicingPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [invoiceLines, setInvoiceLines] = useState<Map<string, InvoiceLine[]>>(new Map())
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'draft' | 'open' | 'paid'>('all')
  const [finalizingId, setFinalizingId] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadInvoices()

    // Subscribe to real-time updates
    const channel = supabase
      .channel('admin-invoices')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'school_invoices',
        },
        () => {
          loadInvoices()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, filter])

  const loadInvoices = async () => {
    let query = supabase
      .from('school_invoices')
      .select(`
        *,
        school:schools (
          school_name
        )
      `)

    if (filter !== 'all') {
      query = query.eq('status', filter)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Error loading invoices:', error)
      toast.error('Failed to load invoices')
    } else {
      setInvoices(data || [])
      // Load invoice lines for each invoice
      if (data) {
        const invoiceIds = data.map((inv) => inv.id)
        const { data: lines } = await supabase
          .from('invoice_lines')
          .select('*')
          .in('invoice_id', invoiceIds)

        const linesMap = new Map<string, InvoiceLine[]>()
        lines?.forEach((line) => {
          if (!linesMap.has(line.invoice_id)) {
            linesMap.set(line.invoice_id, [])
          }
          linesMap.get(line.invoice_id)!.push(line)
        })
        setInvoiceLines(linesMap)
      }
    }
    setLoading(false)
  }

  const handleFinalize = async (invoiceId: string) => {
    setFinalizingId(invoiceId)
    setProcessing(true)

    try {
      const response = await fetch('/api/invoices/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invoice_id: invoiceId,
          finalize: true,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || data.error || 'Failed to finalise invoice')
      }

      trackInvoiceGeneration(true)
      toast.success('Invoice finalised successfully')
      loadInvoices()
    } catch (error: any) {
      trackInvoiceGeneration(false)
      toast.error(error.message || 'Failed to finalise invoice')
    } finally {
      setProcessing(false)
      setFinalizingId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      draft: 'secondary',
      open: 'default',
      paid: 'default',
      void: 'destructive',
    }

    const labels: Record<string, string> = {
      draft: 'Draft',
      open: 'Open',
      paid: 'Paid',
      void: 'Void',
    }

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {labels[status] || status}
      </Badge>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Invoice Management</h1>
        <p className="text-gray-600">Manage school invoices and billing</p>
      </div>

      <Card className="p-6 mb-6">
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'draft' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('draft')}
          >
            Draft
          </Button>
          <Button
            variant={filter === 'open' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('open')}
          >
            Open
          </Button>
          <Button
            variant={filter === 'paid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('paid')}
          >
            Paid
          </Button>
        </div>
      </Card>

      {loading ? (
        <Card className="p-12 text-center">
          <p className="text-gray-600">Loading...</p>
        </Card>
      ) : (
        <Card className="p-6">
          {invoices.length === 0 ? (
            <p className="text-gray-600">No invoices found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>School</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Issued</TableHead>
                  <TableHead>Lines</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => {
                  const schoolData = Array.isArray(invoice.school)
                    ? invoice.school[0]
                    : invoice.school

                  const lines = invoiceLines.get(invoice.id) || []

                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        {schoolData?.school_name || 'Unknown'}
                      </TableCell>
                      <TableCell>£{Number(invoice.amount).toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell>
                        {invoice.issued_at
                          ? new Date(invoice.issued_at).toLocaleDateString()
                          : '-'}
                      </TableCell>
                      <TableCell>{lines.length} item(s)</TableCell>
                      <TableCell className="text-right">
                        {invoice.status === 'draft' && (
                          <Button
                            size="sm"
                            onClick={() => handleFinalize(invoice.id)}
                            disabled={processing && finalizingId === invoice.id}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Finalize Invoice
                          </Button>
                        )}
                        {invoice.status === 'open' && (
                          <span className="text-sm text-gray-600">Awaiting Payment</span>
                        )}
                        {invoice.status === 'paid' && (
                          <Badge variant="default" className="bg-green-600">
                            Paid
                          </Badge>
                        )}
                        {invoice.stripe_invoice_id && (
                          <a
                            href={`https://dashboard.stripe.com/invoices/${invoice.stripe_invoice_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary-600 hover:underline ml-2"
                          >
                            View in Stripe
                          </a>
                        )}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </Card>
      )}
    </div>
  )
}
