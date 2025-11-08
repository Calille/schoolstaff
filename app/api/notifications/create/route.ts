import { NextRequest, NextResponse } from 'next/server'
import { notifyUsers } from '@/lib/notifications'

/**
 * Server-only endpoint to create notifications
 * Requires service role key or admin authentication
 */
export async function POST(request: NextRequest) {
  try {
    // Verify service role key or admin access
    const authHeader = request.headers.get('authorization')
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!authHeader || !serviceRoleKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Simple check - in production, use proper auth
    if (!authHeader.includes(serviceRoleKey)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { user_ids, type, payload } = body

    if (!user_ids || !Array.isArray(user_ids) || !type) {
      return NextResponse.json(
        { error: 'user_ids (array) and type are required' },
        { status: 400 }
      )
    }

    await notifyUsers(user_ids, type, payload || {})

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating notifications:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

