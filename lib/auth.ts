import { createClient } from './supabase/server'
import { redirect } from 'next/navigation'

export async function getSession() {
  const supabase = await createClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}

export async function getUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function getUserProfile() {
  const supabase = await createClient()
  const user = await getUser()
  
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}

export async function getSchoolProfile() {
  const profile = await getUserProfile()
  if (!profile || profile.role !== 'school') return null

  const supabase = await createClient()
  const { data: schoolProfile } = await supabase
    .from('schools')
    .select('*')
    .eq('profile_id', profile.id)
    .single()

  return { ...profile, school: schoolProfile }
}

export async function getStaffProfile() {
  const profile = await getUserProfile()
  if (!profile || profile.role !== 'staff') return null

  const supabase = await createClient()
  const { data: staffProfile } = await supabase
    .from('staff_profiles')
    .select('*')
    .eq('id', profile.id)
    .single()

  return { ...profile, staff: staffProfile }
}

export async function requireAuth() {
  const user = await getUser()
  if (!user) {
    redirect('/login')
  }
  return user
}

export async function requireRole(role: 'school' | 'staff' | 'admin') {
  const profile = await getUserProfile()
  if (!profile) {
    redirect('/login')
  }
  if (!profile.role) {
    redirect('/onboarding')
  }
  if (profile.role !== role) {
    // Redirect to appropriate dashboard
    if (profile.role === 'school') {
      redirect('/dashboard/school')
    } else if (profile.role === 'staff') {
      redirect('/dashboard/staff')
    } else if (profile.role === 'admin') {
      redirect('/admin')
    } else {
      redirect('/onboarding')
    }
  }
  return profile
}

export async function requireOnboardingComplete() {
  const profile = await getUserProfile()
  if (!profile) {
    redirect('/login')
  }
  if (!profile.role) {
    redirect('/onboarding')
  }
  return profile
}
