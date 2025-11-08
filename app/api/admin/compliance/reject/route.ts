import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserProfile } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const user = await getUserProfile()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { document_id } = body

    if (!document_id) {
      return NextResponse.json(
        { error: 'document_id is required' },
        { status: 400 }
      )
    }

    // Get document URL before deleting
    const { data: document } = await supabase
      .from('staff_documents')
      .select('document_url')
      .eq('id', document_id)
      .single()

    // Delete document record
    const { error } = await supabase
      .from('staff_documents')
      .delete()
      .eq('id', document_id)

    if (error) {
      console.error('Error rejecting document:', error)
      return NextResponse.json(
        { error: 'Failed to reject document' },
        { status: 500 }
      )
    }

    // Optionally delete file from storage
    if (document?.document_url) {
      const filePath = document.document_url.split('/staff-documents/')[1]
      if (filePath) {
        await supabase.storage.from('staff-documents').remove([filePath])
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Request error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

