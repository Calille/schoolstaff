import { createClient } from './supabase/server'

interface CalendarEvent {
  summary: string
  description?: string
  start: {
    dateTime: string
    timeZone: string
  }
  end: {
    dateTime: string
    timeZone: string
  }
}

/**
 * Refresh Google Calendar access token
 */
async function refreshAccessToken(refreshToken: string): Promise<string> {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error('Google OAuth not configured')
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(`Token refresh failed: ${data.error}`)
  }

  return data.access_token
}

/**
 * Get valid access token (refresh if needed)
 */
export async function getValidAccessToken(profileId: string): Promise<string | null> {
  const supabase = await createClient()

  const { data: calendar, error } = await supabase
    .from('external_calendars')
    .select('*')
    .eq('profile_id', profileId)
    .eq('provider', 'google')
    .single()

  if (error || !calendar) {
    return null
  }

  // Check if token is expired
  const expiresAt = calendar.expires_at ? new Date(calendar.expires_at) : null
  const isExpired = expiresAt && expiresAt <= new Date()

  if (isExpired && calendar.refresh_token) {
    try {
      const newAccessToken = await refreshAccessToken(calendar.refresh_token)
      
      // Update token in database
      const newExpiresAt = new Date(Date.now() + 3600 * 1000) // 1 hour
      await supabase
        .from('external_calendars')
        .update({
          access_token: newAccessToken,
          expires_at: newExpiresAt.toISOString(),
        })
        .eq('id', calendar.id)

      return newAccessToken
    } catch (error) {
      console.error('Error refreshing token:', error)
      return null
    }
  }

  return calendar.access_token
}

/**
 * Create event in Google Calendar
 */
export async function createCalendarEvent(
  profileId: string,
  event: CalendarEvent
): Promise<string | null> {
  const accessToken = await getValidAccessToken(profileId)

  if (!accessToken) {
    return null
  }

  try {
    const response = await fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(`Calendar API error: ${data.error?.message}`)
    }

    return data.id
  } catch (error) {
    console.error('Error creating calendar event:', error)
    return null
  }
}

