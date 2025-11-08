'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Upload, CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'

interface Document {
  id: string
  document_type: string
  document_url: string | null
  expiry_date: string | null
  verified: boolean
  uploaded_at: string
}

const REQUIRED_DOCUMENTS = [
  { type: 'dbs', label: 'DBS Check', requiresExpiry: true },
  { type: 'right_to_work', label: 'Right to Work Evidence', requiresExpiry: true },
  { type: 'safeguarding_training', label: 'Safeguarding Training Certificate', requiresExpiry: true },
  { type: 'id_passport', label: 'Passport/Photo ID', requiresExpiry: false },
]

function DocumentUploadCard({
  reqDoc,
  status,
  doc,
  onUpload,
  uploading,
}: {
  reqDoc: { type: string; label: string; requiresExpiry: boolean }
  status: string
  doc: Document | undefined
  onUpload: (type: string, file: File, expiryDate?: string) => void
  uploading: boolean
}) {
  const [file, setFile] = useState<File | null>(null)
  const [expiryDate, setExpiryDate] = useState('')

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <Badge variant="default" className="bg-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        )
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-amber-500 text-white">
            <Clock className="h-3 w-3 mr-1" />
            Pending Verification
          </Badge>
        )
      case 'expired':
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Expired
          </Badge>
        )
      default:
        return (
          <Badge variant="destructive">
            <AlertCircle className="h-3 w-3 mr-1" />
            Missing
          </Badge>
        )
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {reqDoc.label}
          </h3>
          <div className="mt-2">{getStatusBadge(status)}</div>
        </div>
      </div>

      {doc?.document_url && (
        <div className="mb-4">
          <a
            href={doc.document_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            View uploaded document
          </a>
          {doc.expiry_date && (
            <p className="text-sm text-gray-600 mt-1">
              Expires: {new Date(doc.expiry_date).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor={`file-${reqDoc.type}`}>Upload Document</Label>
          <Input
            id={`file-${reqDoc.type}`}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => {
              const selectedFile = e.target.files?.[0]
              if (selectedFile) {
                setFile(selectedFile)
              }
            }}
            className="mt-1"
          />
        </div>

        {reqDoc.requiresExpiry && (
          <div>
            <Label htmlFor={`expiry-${reqDoc.type}`}>Expiry Date</Label>
            <Input
              id={`expiry-${reqDoc.type}`}
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="mt-1"
            />
          </div>
        )}

        <Button
          onClick={() => {
            if (file) {
              onUpload(reqDoc.type, file, expiryDate || undefined)
            } else {
              toast.error('Please select a file')
            }
          }}
          disabled={uploading || !file}
          size="sm"
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>
      </div>
    </Card>
  )
}

export default function CompliancePage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [uploading, setUploading] = useState<string | null>(null)
  const [isCompliant, setIsCompliant] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadDocuments()
    checkCompliance()
  }, [])

  const loadDocuments = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'staff') return

    // staff_profiles.id is the same as profiles.id
    const { data, error } = await supabase
      .from('staff_documents')
      .select('*')
      .eq('staff_id', user.id)
      .order('uploaded_at', { ascending: false })

    if (error) {
      console.error('Error loading documents:', error)
    } else {
      setDocuments(data || [])
    }
    setLoading(false)
  }

  const checkCompliance = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'staff') return

    const { data, error } = await supabase
      .from('staff_compliance_status')
      .select('is_compliant')
      .eq('staff_id', user.id)
      .single()

    if (!error && data) {
      setIsCompliant(data.is_compliant || false)
    }
  }

  const handleFileUpload = async (
    documentType: string,
    file: File,
    expiryDate?: string
  ) => {
    if (!file) {
      toast.error('Please select a file')
      return
    }

    setUploading(documentType)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('document_type', documentType)
      if (expiryDate) {
        formData.append('expiry_date', expiryDate)
      }

      const response = await fetch('/api/staff/upload-document', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload document')
      }

      toast.success('Document uploaded successfully. Awaiting verification.')
      loadDocuments()
      checkCompliance()
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload document')
    } finally {
      setUploading(null)
    }
  }

  const getDocumentStatus = (docType: string) => {
    const doc = documents.find((d) => d.document_type === docType)
    if (!doc) return 'missing'

    if (!doc.verified) return 'pending'

    if (doc.expiry_date) {
      const expiry = new Date(doc.expiry_date)
      const today = new Date()
      if (expiry < today) return 'expired'
    }

    return 'verified'
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Compliance Documents</h1>
        <Card className="p-12 text-center">
          <p className="text-gray-600">Loading...</p>
        </Card>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Compliance Documents</h1>
        <p className="text-gray-600">
          Upload required documents to be eligible for school placements
        </p>
      </div>

      {!isCompliant && (
        <Card className="p-6 mb-6 bg-red-50 border-red-200">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
            <div>
              <p className="font-semibold text-red-900">
                Your profile is not currently eligible for school placements
              </p>
              <p className="text-sm text-red-700 mt-1">
                Upload missing documents and ensure all documents are verified to become eligible.
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="space-y-6">
        {REQUIRED_DOCUMENTS.map((reqDoc) => {
          const status = getDocumentStatus(reqDoc.type)
          const doc = documents.find((d) => d.document_type === reqDoc.type)

          return (
            <DocumentUploadCard
              key={reqDoc.type}
              reqDoc={reqDoc}
              status={status}
              doc={doc}
              onUpload={handleFileUpload}
              uploading={uploading === reqDoc.type}
            />
          )
        })}
      </div>
    </div>
  )
}
