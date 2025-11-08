import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserProfile, getSchoolProfile } from '@/lib/auth'

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const user = await getUserProfile()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'school') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const schoolProfile = await getSchoolProfile()
    if (!schoolProfile?.school?.id) {
      return NextResponse.json(
        { error: 'School profile not found' },
        { status: 400 }
      )
    }

    const url = new URL(request.url) as URL
    const requestId = url.searchParams.get('request_id')

    if (!requestId) {
      return NextResponse.json(
        { error: 'request_id is required' },
        { status: 400 }
      )
    }

    // Verify request belongs to this school and is in cart (no batch_id)
    const { data: requestRecord, error: fetchError } = await supabase
      .from('staff_requests')
      .select('id, school_id, batch_id')
      .eq('id', requestId)
      .eq('school_id', schoolProfile.school.id)
      .is('batch_id', null)
      .single()

    if (fetchError || !requestRecord) {
      return NextResponse.json(
        { error: 'Request not found or already submitted' },
        { status: 404 }
      )
    }

    // Delete the request
    const { error: deleteError } = await supabase
      .from('staff_requests')
      .delete()
      .eq('id', requestId)

    if (deleteError) {
      console.error('Error removing from cart:', deleteError)
      return NextResponse.json(
        { error: 'Failed to remove from cart' },
        { status: 500 }
      )
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

