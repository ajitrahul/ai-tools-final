'use client'

import { useState, useEffect } from 'react'

type Tool = { id: string; name: string; logo_url: string; }
type ComparisonData = {
  summary: string;
  tableData: { feature: string; toolA: string; toolB: string; }[];
  verdict: string;
}

export default function ComparePage() {
  const [tools, setTools] = useState<Tool[]>([])
  const [toolA, setToolA] = useState<string>('')
  const [toolB, setToolB] = useState<string>('')
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    async function fetchTools() {
      const res = await fetch('/tools.json')
      const allTools = await res.json()
      setTools(allTools)
      if (allTools.length >= 2) {
        setToolA(allTools[0].id)
        setToolB(allTools[1].id)
      }
    }
    fetchTools()
  }, [])

  const handleCompare = async () => {
    if (!toolA || !toolB || toolA === toolB) {
      setError('Please select two different tools to compare.')
      return
    }
    setError('')
    setIsLoading(true)
    setComparisonData(null)
    try {
      const response = await fetch(`/api/compare?toolA=${toolA}&toolB=${toolB}`)
      if (!response.ok) throw new Error('Failed to fetch comparison data.')
      const data = await response.json()
      setComparisonData(data)
    } catch (err: unknown) {
      setError('An error occurred while generating the comparison. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getToolName = (id: string) => tools.find(t => t.id === id)?.name || 'Tool'

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-heading text-text-main">
          AI Tool Comparison
        </h1>
        <p className="text-lg text-text-secondary mt-4 max-w-2xl mx-auto">
          Select two tools to see an AI-powered, side-by-side comparison.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center rounded-2xl bg-glass border border-glass-border p-6 mb-8">
        <select
          value={toolA}
          onChange={(e) => setToolA(e.target.value)}
          className="w-full px-3 py-3 bg-background border border-glass-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {tools.map((tool) => ( <option key={tool.id} value={tool.id}>{tool.name}</option> ))}
        </select>
        <div className="text-center">
            <button
            onClick={handleCompare}
            disabled={isLoading}
            className="w-full md:w-auto py-3 px-8 bg-primary text-background font-semibold rounded-md hover:bg-primary-focus transition-colors disabled:bg-gray-500"
            >
            {isLoading ? 'Generating...' : 'Compare'}
            </button>
        </div>
        <select
          value={toolB}
          onChange={(e) => setToolB(e.target.value)}
          className="w-full px-3 py-3 bg-background border border-glass-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {tools.map((tool) => ( <option key={tool.id} value={tool.id}>{tool.name}</option> ))}
        </select>
      </div>

      {error && <p className="text-center text-red-400 mb-8">{error}</p>}
      {isLoading && <div className="text-center text-text-secondary">Generating your comparison, please wait...</div>}

      {comparisonData && (
        <div className="space-y-12">
          <div className="rounded-xl bg-glass p-6 border border-glass-border">
            <h2 className="text-3xl font-bold font-heading border-b-2 border-primary/30 pb-3 mb-4">Summary</h2>
            <p className="text-text-secondary leading-relaxed">{comparisonData.summary}</p>
          </div>
          <div className="rounded-xl bg-glass p-6 border border-glass-border">
            <h2 className="text-3xl font-bold font-heading border-b-2 border-primary/30 pb-3 mb-4">Feature Breakdown</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-glass-border">
                    <th className="p-4 w-1/3">Feature</th>
                    <th className="p-4 w-1/3 text-primary font-bold">{getToolName(toolA)}</th>
                    <th className="p-4 w-1/3 text-primary font-bold">{getToolName(toolB)}</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.tableData.map((row, index) => (
                    <tr key={index} className="border-b border-glass-border last:border-none">
                      <td className="p-4 font-semibold">{row.feature}</td>
                      <td className="p-4 text-text-secondary">{row.toolA}</td>
                      <td className="p-4 text-text-secondary">{row.toolB}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="rounded-xl bg-glass p-6 border border-glass-border">
            <h2 className="text-3xl font-bold font-heading border-b-2 border-primary/30 pb-3 mb-4">The Verdict</h2>
            <p className="text-text-secondary leading-relaxed">{comparisonData.verdict}</p>
          </div>
        </div>
      )}
    </div>
  )
}