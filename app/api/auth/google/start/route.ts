import { NextRequest, NextResponse } from 'next/server'
import { getUserProfile } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = await getUserProfile()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const profileId = searchParams.get('profile_id') || user.id

    const clientId = process.env.GOOGLE_CLIENT_ID
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/google/callback`

    if (!clientId) {
      return NextResponse.json(
        { error: 'Google OAuth not configured' },
        { status: 500 }
      )
    }

    const scope = 'https://www.googleapis.com/auth/calendar'
    const state = Buffer.from(JSON.stringify({ profile_id: profileId })).toString('base64')

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: scope,
      access_type: 'offline',
      prompt: 'consent',
      state: state,
    })}`

    return NextResponse.redirect(authUrl)
  } catch (error: any) {
    console.error('Error starting Google OAuth:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

