import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createClient()

  // 1. Authenticate the user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Get the uploaded file from the form data
  const formData = await request.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No file provided.' }, { status: 400 })
  }
  if (file.name !== 'tools.json') {
    return NextResponse.json({ error: 'Invalid filename. Must be tools.json.' }, { status: 400 })
  }

  try {
    // 3. Upload the file to the Supabase Storage bucket
    const { error: uploadError } = await supabase.storage
      .from('ai-tools-data') // The bucket name we created
      .upload(file.name, file, {
        upsert: true, // This will overwrite the file if it already exists
      })

    if (uploadError) {
      throw uploadError
    }

    return NextResponse.json({ message: 'File uploaded successfully!' })

  } catch (error) {
    console.error('Upload Error:', error)
    return NextResponse.json({ error: 'Failed to upload file.' }, { status: 500 })
  }
}