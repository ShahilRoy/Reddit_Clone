'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Header } from '@/components/Header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function CreateCommunityPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!session) {
      router.push('/login')
    }
  }, [session, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.name.trim()) {
      setError('Community name is required')
      return
    }

    if (!/^[a-z0-9_]+$/.test(formData.name)) {
      setError('Community name can only contain lowercase letters, numbers, and underscores')
      return
    }

    if (formData.name.length < 3 || formData.name.length > 21) {
      setError('Community name must be between 3 and 21 characters')
      return
    }

    if (!formData.title.trim()) {
      setError('Title is required')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/communities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create community')
      } else {
        router.push(`/r/${data.name}`)
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Create Community</CardTitle>
            <CardDescription>Create a new community for people to discuss topics</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="name" className="text-sm font-medium">
                  Community Name
                </label>
                <div className="flex items-center mt-1">
                  <span className="text-muted-foreground mr-2">r/</span>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value.toLowerCase() })}
                    required
                    minLength={3}
                    maxLength={21}
                    pattern="[a-z0-9_]+"
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Lowercase letters, numbers, and underscores only
                </p>
              </div>

              <div>
                <label htmlFor="title" className="text-sm font-medium">
                  Title
                </label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  maxLength={100}
                  className="mt-1"
                />
              </div>

              <div>
                <label htmlFor="description" className="text-sm font-medium">
                  Description (optional)
                </label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your community"
                  rows={4}
                  maxLength={500}
                  className="mt-1"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating community...' : 'Create Community'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

