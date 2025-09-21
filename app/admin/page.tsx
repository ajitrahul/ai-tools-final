'use client'

import { useState, useEffect } from 'react'
import UploadForm from '@/components/UploadForm'

type CountryData = { country: string; total: number; today: number; }

export default function AdminPage() {
  const [countryData, setCountryData] = useState<CountryData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch('/api/admin/analytics')
        if (!response.ok) throw new Error('Failed to fetch analytics from the server.')
        const data = await response.json()
        setCountryData(data.geographicalBreakdown || [])
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fade-in">
      <div>
        <h1 className="text-4xl font-bold font-heading">Admin Dashboard</h1>
        <p className="text-text-secondary mt-2">
          {"Welcome, Admin. Here's a snapshot of your site's performance."}
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <div className="rounded-xl bg-glass p-6 border border-glass-border">
                <h2 className="text-2xl font-bold font-heading border-b-2 border-primary/30 pb-3 mb-6">
                    Visitors by Country (Last 30 Days)
                </h2>
                {isLoading && <p className="text-text-secondary">Loading live data...</p>}
                {error && <p className="text-red-400">Error: {error}</p>}
                {!isLoading && !error && (
                    <ul className="space-y-3">
                        {countryData.length > 0 ? (
                            countryData.map((item, index) => (
                                <li key={index} className="flex justify-between items-center bg-background p-3 rounded-md">
                                    <span className="font-semibold text-text-main">{item.country}</span>
                                    <span className="text-text-secondary">Total Visitors: <span className="font-bold text-primary">{item.total.toLocaleString()}</span></span>
                                </li>
                            ))
                        ) : (
                            <p className="text-text-secondary">No country data available yet.</p>
                        )}
                    </ul>
                )}
            </div>
        </div>
        <div className="lg:col-span-1 space-y-8">
            <div className="rounded-xl bg-glass p-6 border border-glass-border">
                <h2 className="text-2xl font-bold font-heading border-b-2 border-primary/30 pb-3 mb-6">
                    Content Management
                </h2>
                <UploadForm />
            </div>
        </div>
      </div>
    </div>
  )
}