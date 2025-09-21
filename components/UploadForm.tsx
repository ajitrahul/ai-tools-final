'use client'

import { useState } from 'react'

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.name !== 'tools.json') {
        setMessage('Error: Filename must be exactly "tools.json"')
        setFile(null)
      } else {
        setFile(selectedFile)
        setMessage('')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) {
      setMessage('Please select a tools.json file to upload.')
      return
    }
    setIsUploading(true)
    setMessage('Uploading...')

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/admin/upload-tools', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }
      setMessage(`Success: ${data.message}`)
    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="file-upload" className="block text-sm font-medium text-text-secondary mb-2">
          Select `tools.json` file
        </label>
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="block w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
        />
      </div>
      <button
        type="submit"
        disabled={isUploading || !file}
        className="w-full py-2 px-4 bg-primary text-white font-semibold rounded-md hover:bg-primary/90 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
      >
        {isUploading ? 'Uploading...' : 'Upload File'}
      </button>
      {message && <p className="text-sm text-center mt-4">{message}</p>}
    </form>
  )
}