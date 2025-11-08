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
    const { request_id, staff_id } = body

    if (!request_id || !staff_id) {
      return NextResponse.json(
        { error: 'request_id and staff_id are required' },
        { status: 400 }
      )
    }

    // Verify request exists and is pending
    const { data: requestRecord, error: fetchError } = await supabase
      .from('staff_requests')
      .select('id, status, batch_id')
      .eq('id', request_id)
      .single()

    if (fetchError || !requestRecord) {
      return NextResponse.json(
        { error: 'Request not found' },
        { status: 404 }
      )
    }

    if (requestRecord.status !== 'pending') {
      return NextResponse.json(
        { error: 'Request is not pending' },
        { status: 400 }
      )
    }

    // Verify staff exists
    const { data: staffRecord, error: staffError } = await supabase
      .from('staff_profiles')
      .select('id')
      .eq('id', staff_id)
      .single()

    if (staffError || !staffRecord) {
      return NextResponse.json(
        { error: 'Staff profile not found' },
        { status: 404 }
      )
    }

    // Update request
    const { error: updateError } = await supabase
      .from('staff_requests')
      .update({
        staff_id: staff_id,
        status: 'accepted',
      })
      .eq('id', request_id)

    if (updateError) {
      console.error('Error updating request:', updateError)
      return NextResponse.json(
        { error: 'Failed to assign staff' },
        { status: 500 }
      )
    }

    // Batch status will be auto-updated by the trigger function
    // But we can also manually trigger it if needed
    if (requestRecord.batch_id) {
      // The trigger should handle this automatically, but we'll verify
      const { data: batchRequests } = await supabase
        .from('staff_requests')
        .select('status')
        .eq('batch_id', requestRecord.batch_id)

      if (batchRequests) {
        const acceptedCount = batchRequests.filter((r) => r.status === 'accepted').length
        const declinedCount = batchRequests.filter((r) => r.status === 'declined').length
        const totalCount = batchRequests.length

        let newBatchStatus = 'pending'
        if (acceptedCount === totalCount && totalCount > 0) {
          newBatchStatus = 'confirmed'
        } else if (acceptedCount > 0 && declinedCount > 0) {
          newBatchStatus = 'partially_confirmed'
        } else if (declinedCount === totalCount && totalCount > 0) {
          newBatchStatus = 'cancelled'
        }

        await supabase
          .from('staff_request_batches')
          .update({ status: newBatchStatus })
          .eq('id', requestRecord.batch_id)
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

