'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { CheckCircle, XCircle, Clock } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface ComplianceDocument {
  id: string
  staff_id: string
  document_type: string
  document_url: string | null
  expiry_date: string | null
  verified: boolean
  uploaded_at: string
  staff: {
    profiles: {
      full_name: string
    }
  }
}

export default function AdminCompliancePage() {
  const [documents, setDocuments] = useState<ComplianceDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    loadDocuments()

    // Subscribe to real-time updates
    const channel = supabase
      .channel('admin-compliance')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'staff_documents',
        },
        () => {
          loadDocuments()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const loadDocuments = async () => {
    const { data, error } = await supabase
      .from('staff_documents')
      .select(`
        *,
        staff:staff_profiles (
          profiles (
            full_name
          )
        )
      `)
      .order('uploaded_at', { ascending: false })

    if (error) {
      console.error('Error loading documents:', error)
      toast.error('Failed to load documents')
    } else {
      setDocuments(data || [])
    }
    setLoading(false)
  }

  const handleVerify = async (documentId: string) => {
    setProcessing(documentId)

    try {
      const response = await fetch('/api/admin/compliance/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ document_id: documentId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify document')
      }

      toast.success('Document verified')
      loadDocuments()
    } catch (error: any) {
      toast.error(error.message || 'Failed to verify document')
    } finally {
      setProcessing(null)
    }
  }

  const handleReject = async (documentId: string) => {
    if (!confirm('Are you sure you want to reject this document? It will be deleted.')) {
      return
    }

    setProcessing(documentId)

    try {
      const response = await fetch('/api/admin/compliance/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ document_id: documentId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reject document')
      }

      toast.success('Document rejected and deleted')
      loadDocuments()
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject document')
    } finally {
      setProcessing(null)
    }
  }

  const getDocumentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      dbs: 'DBS Check',
      right_to_work: 'Right to Work',
      safeguarding_training: 'Safeguarding Training',
      id_passport: 'Passport/Photo ID',
    }
    return labels[type] || type
  }

  const getStatusBadge = (verified: boolean, expiryDate: string | null) => {
    if (!verified) {
      return (
        <Badge variant="secondary" className="bg-amber-500 text-white">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      )
    }

    if (expiryDate) {
      const expiry = new Date(expiryDate)
      const today = new Date()
      if (expiry < today) {
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Expired
          </Badge>
        )
      }
    }

    return (
      <Badge variant="default" className="bg-green-600">
        <CheckCircle className="h-3 w-3 mr-1" />
        Verified
      </Badge>
    )
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Compliance Review</h1>
        <Card className="p-12 text-center">
          <p className="text-gray-600">Loading...</p>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Compliance Review</h1>
        <p className="text-gray-600">
          Review and verify staff compliance documents
        </p>
      </div>

      <Card className="p-6">
        {documents.length === 0 ? (
          <p className="text-gray-600">No documents to review</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Name</TableHead>
                <TableHead>Document Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => {
                const staffData = Array.isArray(doc.staff)
                  ? doc.staff[0]
                  : doc.staff

                const staffProfile = staffData?.profiles
                  ? Array.isArray(staffData.profiles)
                    ? staffData.profiles[0]
                    : staffData.profiles
                  : null

                return (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">
                      {staffProfile?.full_name || 'Unknown Staff'}
                    </TableCell>
                    <TableCell>{getDocumentTypeLabel(doc.document_type)}</TableCell>
                    <TableCell>
                      {getStatusBadge(doc.verified, doc.expiry_date)}
                    </TableCell>
                    <TableCell>{formatDate(doc.expiry_date)}</TableCell>
                    <TableCell>{formatDate(doc.uploaded_at)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {doc.document_url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(doc.document_url!, '_blank')}
                          >
                            View
                          </Button>
                        )}
                        {!doc.verified && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleVerify(doc.id)}
                              disabled={processing === doc.id}
                            >
                              Verify
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(doc.id)}
                              disabled={processing === doc.id}
                            >
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}
