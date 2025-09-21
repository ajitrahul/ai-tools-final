'use client'

import { useState, useEffect } from 'react'

// Define the types for our data for type safety
type Tool = {
  id: string
  name: string
  logo_url: string
}

type ComparisonData = {
  summary: string
  tableData: {
    feature: string
    toolA: string
    toolB: string
  }[]
  verdict: string
}

export default function ComparePage() {
  const [tools, setTools] = useState<Tool[]>([])
  const [toolA, setToolA] = useState<string>('')
  const [toolB, setToolB] = useState<string>('')
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  // Effect to fetch the list of all tools when the component mounts
  useEffect(() => {
    async function fetchTools() {
      // In a real app, you might fetch this from an API,
      // but for now we can fetch it from the public JSON file.
      const res = await fetch('/tools.json')
      const allTools = await res.json()
      setTools(allTools)
      // Set default tools for comparison
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
      if (!response.ok) {
        throw new Error('Failed to fetch comparison data.')
      }
      const data = await response.json()
      setComparisonData(data)
    } catch (err) {
      setError('An error occurred while generating the comparison. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }
  
  // Helper to get tool name from ID
  const getToolName = (id: string) => tools.find(t => t.id === id)?.name || 'Tool'

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-text-main">
          AI Tool Comparison
        </h1>
        <p className="text-lg text-text-secondary mt-4 max-w-2xl mx-auto">
          Select two tools to see an AI-powered, side-by-side comparison.
        </p>
      </div>

      {/* Selection UI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-secondary p-6 rounded-lg mb-8">
        <select
          value={toolA}
          onChange={(e) => setToolA(e.target.value)}
          className="w-full px-3 py-3 bg-background border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {tools.map((tool) => (
            <option key={tool.id} value={tool.id}>{tool.name}</option>
          ))}
        </select>
        
        <div className="text-center">
            <button
            onClick={handleCompare}
            disabled={isLoading}
            className="w-full md:w-auto py-3 px-8 bg-primary text-white font-semibold rounded-md hover:bg-primary/90 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
            {isLoading ? 'Generating...' : 'Compare'}
            </button>
        </div>

        <select
          value={toolB}
          onChange={(e) => setToolB(e.target.value)}
          className="w-full px-3 py-3 bg-background border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {tools.map((tool) => (
            <option key={tool.id} value={tool.id}>{tool.name}</option>
          ))}
        </select>
      </div>

      {error && <p className="text-center text-red-400 mb-8">{error}</p>}

      {/* Results Display */}
      {isLoading && <div className="text-center text-text-secondary">Generating your comparison, please wait...</div>}

      {comparisonData && (
        <div className="space-y-12 animate-fade-in">
          {/* Summary */}
          <div>
            <h2 className="text-3xl font-bold border-b-2 border-primary/30 pb-3 mb-4">Summary</h2>
            <p className="text-text-secondary leading-relaxed">{comparisonData.summary}</p>
          </div>

          {/* Comparison Table */}
          <div>
            <h2 className="text-3xl font-bold border-b-2 border-primary/30 pb-3 mb-4">Feature Breakdown</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left bg-secondary rounded-lg">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="p-4 w-1/3">Feature</th>
                    <th className="p-4 w-1/3 text-primary font-bold">{getToolName(toolA)}</th>
                    <th className="p-4 w-1/3 text-primary font-bold">{getToolName(toolB)}</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.tableData.map((row, index) => (
                    <tr key={index} className="border-b border-gray-700 last:border-none">
                      <td className="p-4 font-semibold">{row.feature}</td>
                      <td className="p-4 text-text-secondary">{row.toolA}</td>
                      <td className="p-4 text-text-secondary">{row.toolB}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Verdict */}
          <div>
            <h2 className="text-3xl font-bold border-b-2 border-primary/30 pb-3 mb-4">The Verdict</h2>
            <p className="text-text-secondary leading-relaxed">{comparisonData.verdict}</p>
          </div>
        </div>
      )}
    </div>
  )
}