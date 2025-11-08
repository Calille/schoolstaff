import { supabaseAdmin } from './supabaseAdmin'

/**
 * Server-only helper to create notifications for users
 * Uses service role key to bypass RLS
 */
export async function notifyUserIds(
  userIds: string[],
  type: string,
  payload: Record<string, any> = {}
): Promise<void> {
  if (userIds.length === 0) return

  const notifications = userIds.map((userId) => ({
    user_id: userId,
    type,
    payload,
    read: false,
  }))

  const { error } = await supabaseAdmin.from('notifications').insert(notifications)

  if (error) {
    console.error('Error creating notifications:', error)
    throw new Error(`Failed to create notifications: ${error.message}`)
  }
}

/**
 * Create a single notification
 */
export async function notifyUserId(
  userId: string,
  type: string,
  payload: Record<string, any> = {}
): Promise<void> {
  await notifyUserIds([userId], type, payload)
}

