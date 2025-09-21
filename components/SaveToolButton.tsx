'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'

type SaveToolButtonProps = { toolId: string; user: User | null; }

export default function SaveToolButton({ toolId, user }: SaveToolButtonProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (user) {
      const checkStatus = async () => {
        const response = await fetch(`/api/save-tool?tool_id=${toolId}`)
        if (response.ok) {
          const data = await response.json()
          setIsSaved(data.isSaved)
        }
        setIsLoading(false)
      }
      checkStatus()
    } else {
      setIsLoading(false)
    }
  }, [toolId, user])

  const handleSaveToggle = async () => {
    if (!user) {
      router.push('/login')
      return
    }
    setIsLoading(true)
    const response = await fetch('/api/save-tool', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool_id: toolId }),
    })
    if (response.ok) {
      const data = await response.json()
      setIsSaved(data.isSaved)
    }
    setIsLoading(false)
  }

  return (
    <button
      onClick={handleSaveToggle}
      disabled={isLoading}
      className={`w-full py-3 px-4 font-semibold rounded-md transition-colors disabled:opacity-50 ${
        isSaved
          ? 'bg-red-500 hover:bg-red-600 text-white'
          : 'bg-primary hover:bg-primary-focus text-background'
      }`}
    >
      {isLoading ? 'Loading...' : isSaved ? 'Unsave Tool' : 'Save Tool'}
    </button>
  )
}