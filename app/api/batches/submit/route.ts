import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserProfile, getSchoolProfile } from '@/lib/auth'

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { notes } = body

    // Get all unbatched requests for this school
    const { data: cartRequests, error: fetchError } = await supabase
      .from('staff_requests')
      .select('id')
      .eq('school_id', schoolProfile.school.id)
      .is('batch_id', null)
      .eq('status', 'pending')

    if (fetchError) {
      console.error('Error fetching cart requests:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch cart items' },
        { status: 500 }
      )
    }

    if (!cartRequests || cartRequests.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart to submit' },
        { status: 400 }
      )
    }

    // Create batch
    const { data: batch, error: batchError } = await supabase
      .from('staff_request_batches')
      .insert({
        school_id: schoolProfile.school.id,
        status: 'pending',
        notes: notes || null,
      })
      .select()
      .single()

    if (batchError) {
      console.error('Error creating batch:', batchError)
      return NextResponse.json(
        { error: 'Failed to create batch' },
        { status: 500 }
      )
    }

    // Update all cart requests with batch_id
    const requestIds = cartRequests.map((r) => r.id)
    const { error: updateError } = await supabase
      .from('staff_requests')
      .update({ batch_id: batch.id })
      .in('id', requestIds)

    if (updateError) {
      console.error('Error updating requests:', updateError)
      // Try to delete the batch if update fails
      await supabase.from('staff_request_batches').delete().eq('id', batch.id)
      return NextResponse.json(
        { error: 'Failed to submit batch' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, batch_id: batch.id }, { status: 201 })
  } catch (error: any) {
    console.error('Request error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

