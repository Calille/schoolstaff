import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (!code || !state) {
      return NextResponse.redirect('/dashboard/staff/calendar?error=missing_params')
    }

    const { profile_id } = JSON.parse(Buffer.from(state, 'base64').toString())

    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/google/callback`

    if (!clientId || !clientSecret) {
      return NextResponse.redirect('/dashboard/staff/calendar?error=not_configured')
    }

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })

    const tokens = await tokenResponse.json()

    if (!tokenResponse.ok) {
      console.error('Token exchange error:', tokens)
      return NextResponse.redirect('/dashboard/staff/calendar?error=token_exchange')
    }

    // Get token expiry
    const expiresAt = tokens.expires_in
      ? new Date(Date.now() + tokens.expires_in * 1000)
      : null

    // Save tokens to database
    const supabase = await createClient()
    const { error: dbError } = await supabase
      .from('external_calendars')
      .upsert({
        profile_id,
        provider: 'google',
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: expiresAt?.toISOString(),
      })

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.redirect('/dashboard/staff/calendar?error=database')
    }

    return NextResponse.redirect('/dashboard/staff/calendar?success=connected')
  } catch (error: any) {
    console.error('Error in Google OAuth callback:', error)
    return NextResponse.redirect('/dashboard/staff/calendar?error=internal')
  }
}

