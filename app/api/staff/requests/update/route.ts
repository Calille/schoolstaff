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

    if (user.role !== 'staff') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { request_id, status } = body

    if (!request_id || !status) {
      return NextResponse.json(
        { error: 'request_id and status are required' },
        { status: 400 }
      )
    }

    if (!['accepted', 'declined'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be "accepted" or "declined"' },
        { status: 400 }
      )
    }

    // Verify the request belongs to this staff member
    const { data: existingRequest, error: fetchError } = await supabase
      .from('staff_requests')
      .select('staff_id, status')
      .eq('id', request_id)
      .single()

    if (fetchError || !existingRequest) {
      return NextResponse.json(
        { error: 'Request not found' },
        { status: 404 }
      )
    }

    if (existingRequest.staff_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      )
    }

    if (existingRequest.status !== 'pending') {
      return NextResponse.json(
        { error: 'Request has already been processed' },
        { status: 400 }
      )
    }

    // Update the request status
    const { data, error } = await supabase
      .from('staff_requests')
      .update({ status })
      .eq('id', request_id)
      .select()
      .single()

    if (error) {
      console.error('Error updating request:', error)
      return NextResponse.json(
        { error: 'Failed to update request' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (error: any) {
    console.error('Request error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

