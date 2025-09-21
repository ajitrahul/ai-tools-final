'use client' // Important: This converts the page to a Client Component

import { useState, useEffect } from 'react'
import UploadForm from '@/components/UploadForm'

// --- Define types for our analytics data ---
type CountryData = {
  country: string
  total: number
  today: number // Note: Our current API doesn't populate this, but the structure is ready
}

// --- Helper Component for a single metric display ---
const AnalyticsMetric = ({ title, value, change }: { title: string; value: string; change?: string }) => {
    return (
        <div className="bg-background-start p-4 rounded-lg shadow-inner">
            <h3 className="text-sm font-medium text-text-secondary">{title}</h3>
            <div className="flex items-baseline justify-between">
                <p className="text-2xl font-bold font-heading text-text-main">{value}</p>
                {change && <span className="text-sm font-semibold text-green-400">{change}</span>}
            </div>
        </div>
    )
}

// --- Main Admin Page ---
export default function AdminPage() {
  const [countryData, setCountryData] = useState<CountryData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // This effect runs when the component mounts to fetch live data
  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch('/api/admin/analytics')
        if (!response.ok) {
          throw new Error('Failed to fetch analytics from the server.')
        }
        const data = await response.json()
        setCountryData(data.geographicalBreakdown || [])
      } catch (err: any) {
        setError(err.message)
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
          Welcome, Admin. Here's a snapshot of your site's performance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <div className="rounded-xl bg-white/5 p-6 ring-1 ring-inset ring-white/10 backdrop-blur-md">
                <h2 className="text-2xl font-bold font-heading border-b-2 border-primary/30 pb-3 mb-6">
                    Visitors by Country (Last 30 Days)
                </h2>
                {isLoading && <p className="text-text-secondary">Loading live data...</p>}
                {error && <p className="text-red-400">Error: {error}</p>}
                {!isLoading && !error && (
                    <ul className="space-y-3">
                        {countryData.length > 0 ? (
                            countryData.map((item, index) => (
                                <li key={index} className="flex justify-between items-center bg-background-start p-3 rounded-md shadow-inner">
                                    <span className="font-semibold text-text-main">{item.country}</span>
                                    <span className="text-text-secondary">Total Visitors: <span className="font-bold text-accent">{item.total.toLocaleString()}</span></span>
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
            <div className="rounded-xl bg-white/5 p-6 ring-1 ring-inset ring-white/10 backdrop-blur-md">
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