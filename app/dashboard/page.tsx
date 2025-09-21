import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getTools } from '@/lib/data'
import ToolCard from '@/components/ToolCard'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const allTools = await getTools()
  const { data: savedToolsData } = await supabase
    .from('SavedTools')
    .select('tool_id')
    .eq('user_id', user.id)

  const savedToolIds = savedToolsData?.map(item => item.tool_id) || []
  const savedTools = allTools.filter(tool => savedToolIds.includes(tool.id))

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="mb-12">
        <h1 className="text-3xl font-bold font-heading">User Dashboard</h1>
        <p className="text-text-secondary mt-2">
          Welcome back, <span className="font-mono text-primary">{user.email}</span>
        </p>
      </div>
      <div>
        <h2 className="text-2xl font-bold font-heading border-b-2 border-primary/30 pb-3 mb-6">
          My Saved Tools
        </h2>
        {savedTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedTools.map((tool) => ( <ToolCard key={tool.id} tool={tool} /> ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-2xl bg-glass border border-glass-border">
            <p className="text-text-secondary">{"You haven't saved any tools yet."}</p>
          </div>
        )}
      </div>
    </div>
  )
}