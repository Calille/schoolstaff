import { createClient } from './supabase/server'

/**
 * Create notifications for multiple users
 * Requires service role key for server-side operations
 */
export async function notifyUsers(
  userIds: string[],
  type: string,
  payload: Record<string, any> = {}
): Promise<void> {
  const supabase = await createClient()

  // Insert notifications for each user
  const notifications = userIds.map((userId) => ({
    user_id: userId,
    type,
    payload,
  }))

  const { error } = await supabase.from('notifications').insert(notifications)

  if (error) {
    console.error('Error creating notifications:', error)
    throw new Error(`Failed to create notifications: ${error.message}`)
  }
}

/**
 * Create a single notification
 */
export async function notifyUser(
  userId: string,
  type: string,
  payload: Record<string, any> = {}
): Promise<void> {
  await notifyUsers([userId], type, payload)
}

/**
 * Mark notification as read
 */
export async function markNotificationRead(
  notificationId: string,
  userId: string
): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
    .eq('user_id', userId)

  if (error) {
    throw new Error(`Failed to mark notification as read: ${error.message}`)
  }
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsRead(userId: string): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false)

  if (error) {
    throw new Error(`Failed to mark all notifications as read: ${error.message}`)
  }
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(userId: string): Promise<number> {
  const supabase = await createClient()

  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('read', false)

  if (error) {
    console.error('Error getting unread count:', error)
    return 0
  }

  return count || 0
}

