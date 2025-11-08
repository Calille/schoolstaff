'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export function CartCount() {
  const [count, setCount] = useState(0)
  const [isSchool, setIsSchool] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null

    const checkRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role === 'school') {
        setIsSchool(true)
        loadCount()

        // Subscribe to real-time updates
        const { data: school } = await supabase
          .from('schools')
          .select('id')
          .eq('profile_id', user.id)
          .single()

        if (school?.id) {
          channel = supabase
            .channel('cart-count')
            .on(
              'postgres_changes',
              {
                event: '*',
                schema: 'public',
                table: 'staff_requests',
                filter: `school_id=eq.${school.id}`,
              },
              () => {
                loadCount()
              }
            )
            .subscribe()
        }
      }
    }

    checkRole()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [supabase])

  const loadCount = async () => {
    try {
      const response = await fetch('/api/cart/count')
      const data = await response.json()
      setCount(data.count || 0)
    } catch (error) {
      console.error('Error loading cart count:', error)
    }
  }

  if (!isSchool || count === 0) {
    return null
  }

  return (
    <Link href="/dashboard/school/request-cart">
      <Badge variant="secondary" className="cursor-pointer hover:bg-gray-200">
        Request Cart ({count})
      </Badge>
    </Link>
  )
}

