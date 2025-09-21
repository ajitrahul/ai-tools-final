'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    getUser()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    router.push('/')
    router.refresh()
  }

  return user ? (
    <div className="flex items-center gap-4">
      <Link href="/dashboard" className="text-sm hover:text-primary transition-colors">
        Dashboard
      </Link>
      <span className="text-sm text-text-secondary hidden sm:block">{user.email}</span>
      <button
        onClick={handleSignOut}
        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
      >
        Sign Out
      </button>
    </div>
  ) : (
    <Link
      href="/login"
      className="bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-md transition-colors"
    >
      Sign In
    </Link>
  )
}