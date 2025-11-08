import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { requireRole, getSchoolProfile } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { CreditCard, Receipt } from 'lucide-react'
import { BillingActions } from '@/components/billing-actions'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default async function BillingPage() {
  const profile = await requireRole('school')
  const schoolProfile = await getSchoolProfile()
  const supabase = await createClient()

  if (!schoolProfile?.school?.id) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Billing</h1>
        <Card className="p-6">
          <p className="text-gray-600">School profile not found.</p>
        </Card>
      </div>
    )
  }

  // Get invoices
  const { data: invoices } = await supabase
    .from('school_invoices')
    .select('*')
    .eq('school_id', schoolProfile.school.id)
    .order('created_at', { ascending: false })

  // Get unpaid requests
  const { data: unpaidRequests } = await supabase
    .from('staff_requests')
    .select(`
      *,
      staff:staff_profiles (
        profiles (
          full_name
        )
      )
    `)
    .eq('school_id', schoolProfile.school.id)
    .eq('status', 'accepted')
    .eq('paid', false)

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      paid: 'default',
      open: 'secondary',
      draft: 'secondary',
      void: 'destructive',
    }

    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const formatCurrency = (amount: number | null) => {
    if (amount === null) return '-'
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing</h1>
        <p className="text-gray-600">
          Manage your payment methods and view invoices
        </p>
      </div>

      {/* Payment Method */}
      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CreditCard className="h-8 w-8 text-gray-400" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Payment Method
              </h2>
              <p className="text-sm text-gray-600">
                {schoolProfile.school.stripe_customer_id
                  ? 'Payment method on file'
                  : 'No payment method added'}
              </p>
            </div>
          </div>
          <BillingActions
            hasCustomer={!!schoolProfile.school.stripe_customer_id}
          />
        </div>
      </Card>

      {/* Unpaid Requests */}
      {unpaidRequests && unpaidRequests.length > 0 && (
        <Card className="p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Pending Payments
          </h2>
          <div className="space-y-3">
            {unpaidRequests.map((request) => {
              const staffData = Array.isArray(request.staff)
                ? request.staff[0]
                : request.staff
              const staffProfile = Array.isArray(staffData?.profiles)
                ? staffData?.profiles[0]
                : staffData?.profiles

              return (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {staffProfile?.full_name || 'Staff Member'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Request ID: {request.id.slice(0, 8)}...
                    </p>
                  </div>
                  <BillingActions
                    hasCustomer={!!schoolProfile.school.stripe_customer_id}
                    requestId={request.id}
                  />
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Invoices */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Invoice History
        </h2>
        {!invoices || invoices.length === 0 ? (
          <p className="text-gray-600">No invoices yet</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-mono text-sm">
                    {invoice.stripe_invoice_id || invoice.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell>
                    {new Date(invoice.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}

