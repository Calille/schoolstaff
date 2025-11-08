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
    const { staff_id, weekdays } = body

    if (!staff_id) {
      return NextResponse.json(
        { error: 'staff_id is required' },
        { status: 400 }
      )
    }

    // Validate weekdays if provided
    if (weekdays && Array.isArray(weekdays)) {
      const validWeekdays = ['mon', 'tue', 'wed', 'thu', 'fri']
      const invalidWeekdays = weekdays.filter((w: string) => !validWeekdays.includes(w))
      if (invalidWeekdays.length > 0) {
        return NextResponse.json(
          { error: `Invalid weekdays: ${invalidWeekdays.join(', ')}` },
          { status: 400 }
        )
      }
    }

    // Verify staff profile exists
    const { data: staffProfile, error: staffError } = await supabase
      .from('staff_profiles')
      .select('id')
      .eq('id', staff_id)
      .single()

    if (staffError || !staffProfile) {
      return NextResponse.json(
        { error: 'Staff profile not found' },
        { status: 404 }
      )
    }

    // Check if request already exists
    const { data: existingRequest } = await supabase
      .from('staff_requests')
      .select('id')
      .eq('school_id', schoolProfile.school.id)
      .eq('staff_id', staff_id)
      .eq('status', 'pending')
      .single()

    if (existingRequest) {
      return NextResponse.json(
        { error: 'A pending request already exists for this staff member' },
        { status: 400 }
      )
    }

    // Create the request
    const { data, error } = await supabase
      .from('staff_requests')
      .insert({
        school_id: schoolProfile.school.id,
        staff_id: staff_id,
        status: 'pending',
        weekdays: weekdays || null,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating request:', error)
      return NextResponse.json(
        { error: 'Failed to create request' },
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

