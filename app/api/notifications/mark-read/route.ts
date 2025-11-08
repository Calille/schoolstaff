import { NextRequest, NextResponse } from 'next/server'
import { markNotificationRead, markAllNotificationsRead } from '@/lib/notifications'
import { getUserProfile } from '@/lib/auth'

export async function PATCH(request: NextRequest) {
  try {
    const user = await getUserProfile()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { notification_id, mark_all } = body

    if (mark_all) {
      await markAllNotificationsRead(user.id)
    } else if (notification_id) {
      await markNotificationRead(notification_id, user.id)
    } else {
      return NextResponse.json(
        { error: 'notification_id or mark_all required' },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error marking notification as read:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

