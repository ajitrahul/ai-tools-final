import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getTools, type Tool } from '@/lib/data' // Import our data helpers
import ToolCard from '@/components/ToolCard' // We can reuse our ToolCard component!

export default async function DashboardPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 1. Fetch all tool details from our JSON file
  const allTools = await getTools()

  // 2. Fetch the IDs of the tools the user has saved
  const { data: savedToolsData, error } = await supabase
    .from('SavedTools')
    .select('tool_id')
    .eq('user_id', user.id)

  if (error) {
    console.error('Error fetching saved tools:', error)
    // Handle the error appropriately
  }

  // 3. Filter the full tool list to get only the ones the user saved
  const savedToolIds = savedToolsData?.map(item => item.tool_id) || []
  const savedTools = allTools.filter(tool => savedToolIds.includes(tool.id))

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-12">
        <h1 className="text-3xl font-bold">User Dashboard</h1>
        <p className="text-text-secondary mt-2">
          Welcome back, <span className="font-mono text-primary">{user.email}</span>
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold border-b-2 border-primary/30 pb-3 mb-6">
          My Saved Tools
        </h2>
        
        {savedTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-secondary rounded-lg">
            <p className="text-text-secondary">You haven't saved any tools yet.</p>
            <p className="text-text-secondary mt-2">Browse the homepage to find tools to save!</p>
          </div>
        )}
      </div>
      {/* "My Saved Comparisons" section will be added here later */}
    </div>
  )
}