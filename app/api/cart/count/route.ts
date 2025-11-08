import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserProfile, getSchoolProfile } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getUserProfile()

    if (!user || user.role !== 'school') {
      return NextResponse.json({ count: 0 })
    }

    const schoolProfile = await getSchoolProfile()
    if (!schoolProfile?.school?.id) {
      return NextResponse.json({ count: 0 })
    }

    const supabase = await createClient()

    const { count, error } = await supabase
      .from('staff_requests')
      .select('*', { count: 'exact', head: true })
      .eq('school_id', schoolProfile.school.id)
      .is('batch_id', null)
      .eq('status', 'pending')

    if (error) {
      console.error('Error getting cart count:', error)
      return NextResponse.json({ count: 0 })
    }

    return NextResponse.json({ count: count || 0 })
  } catch (error) {
    return NextResponse.json({ count: 0 })
  }
}

