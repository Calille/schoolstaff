import { NextResponse } from 'next/server'
import { getUnreadCount } from '@/lib/notifications'
import { getUserProfile } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getUserProfile()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const count = await getUnreadCount(user.id)

    return NextResponse.json({ count })
  } catch (error: any) {
    console.error('Error getting unread count:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

