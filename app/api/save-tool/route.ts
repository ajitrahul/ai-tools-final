import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { tool_id } = await request.json()

  if (!tool_id) {
    return NextResponse.json({ error: 'Tool ID is required' }, { status: 400 })
  }

  // Check if the tool is already saved
  const { data: existingSave, error: selectError } = await supabase
    .from('SavedTools')
    .select('id')
    .eq('user_id', user.id)
    .eq('tool_id', tool_id)
    .single()

  if (selectError && selectError.code !== 'PGRST116') { // PGRST116 means no rows found
    console.error('Error checking saved tool:', selectError)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  if (existingSave) {
    // If it exists, unsave it (delete the row)
    const { error: deleteError } = await supabase
      .from('SavedTools')
      .delete()
      .eq('id', existingSave.id)
    
    if (deleteError) {
        console.error('Error unsaving tool:', deleteError)
        return NextResponse.json({ error: 'Failed to unsave tool' }, { status: 500 })
    }
    return NextResponse.json({ message: 'Tool unsaved successfully', isSaved: false })

  } else {
    // If it doesn't exist, save it (insert a new row)
    const { error: insertError } = await supabase
      .from('SavedTools')
      .insert({ user_id: user.id, tool_id: tool_id })

    if (insertError) {
        console.error('Error saving tool:', insertError)
        return NextResponse.json({ error: 'Failed to save tool' }, { status: 500 })
    }
    return NextResponse.json({ message: 'Tool saved successfully', isSaved: true })
  }
}

// We also need a GET endpoint to check the saved status of a tool
export async function GET(request: Request) {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
  
    if (!user) {
      return NextResponse.json({ isSaved: false }, { status: 200 })
    }
  
    const { searchParams } = new URL(request.url)
    const tool_id = searchParams.get('tool_id')
  
    if (!tool_id) {
      return NextResponse.json({ error: 'Tool ID is required' }, { status: 400 })
    }
  
    const { data, error } = await supabase
      .from('SavedTools')
      .select('id')
      .eq('user_id', user.id)
      .eq('tool_id', tool_id)
      .single()
  
    if (error && error.code !== 'PGRST116') {
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
  
    return NextResponse.json({ isSaved: !!data })
}