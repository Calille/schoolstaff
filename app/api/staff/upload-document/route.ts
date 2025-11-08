import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserProfile, getStaffProfile } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const user = await getUserProfile()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'staff') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const staffProfile = await getStaffProfile()
    if (!staffProfile?.staff?.id) {
      return NextResponse.json(
        { error: 'Staff profile not found' },
        { status: 400 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const documentType = formData.get('document_type') as string
    const expiryDate = formData.get('expiry_date') as string | null

    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      )
    }

    const validTypes = ['dbs', 'right_to_work', 'safeguarding_training', 'id_passport']
    if (!validTypes.includes(documentType)) {
      return NextResponse.json(
        { error: 'Invalid document type' },
        { status: 400 }
      )
    }

    // Upload to Supabase Storage
    const fileExt = file.name.split('.').pop()
    const fileName = `${staffProfile.staff.id}/${documentType}_${Date.now()}.${fileExt}`
    const filePath = `staff-documents/${fileName}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('staff-documents')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      )
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('staff-documents').getPublicUrl(filePath)

    // Create document record
    const { data, error } = await supabase
      .from('staff_documents')
      .insert({
        staff_id: staffProfile.staff.id,
        document_type: documentType,
        document_url: publicUrl,
        expiry_date: expiryDate || null,
        verified: false,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating document record:', error)
      // Try to delete uploaded file if record creation fails
      await supabase.storage.from('staff-documents').remove([filePath])
      return NextResponse.json(
        { error: 'Failed to create document record' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error: any) {
    console.error('Request error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
