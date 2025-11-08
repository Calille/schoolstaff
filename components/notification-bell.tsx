'use client'

import { useState, useEffect } from 'react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export function NotificationBell() {
  const [count, setCount] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    const loadCount = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('read', false)

      setCount(count || 0)
    }

    const setupSubscription = async () => {
      await loadCount()

      // Subscribe to real-time updates
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const channel = supabase
          .channel('notification-count')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'notifications',
              filter: `user_id=eq.${user.id}`,
            },
            () => {
              loadCount()
            }
          )
          .subscribe()

        return () => {
          supabase.removeChannel(channel)
        }
      }
    }

    const cleanup = setupSubscription()
    return () => {
      cleanup.then((fn) => fn && fn())
    }
  }, [supabase])

  return (
    <Link href="/dashboard/notifications">
      <Button variant="ghost" size="sm" className="relative">
        <Bell className="h-5 w-5" />
        {count > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {count > 9 ? '9+' : count}
          </Badge>
        )}
      </Button>
    </Link>
  )
}

