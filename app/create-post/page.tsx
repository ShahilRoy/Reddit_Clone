'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Header } from '@/components/Header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface Community {
  id: string
  name: string
  title: string
}

function CreatePostForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  const [communities, setCommunities] = useState<Community[]>([])
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    imageUrl: '',
    linkUrl: '',
    communityId: '',
  })
  const [postType, setPostType] = useState<'text' | 'link' | 'image'>('text')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!session) {
      router.push('/login')
      return
    }
    fetchCommunities()
  }, [session, router])

  const fetchCommunities = async () => {
    try {
      const response = await fetch('/api/communities')
      if (response.ok) {
        const data = await response.json()
        setCommunities(data)
        if (searchParams.get('community')) {
          const community = data.find(
            (c: Community) => c.name === searchParams.get('community')
          )
          if (community) {
            setFormData((prev) => ({ ...prev, communityId: community.id }))
          }
        }
      }
    } catch (error) {
      console.error('Error fetching communities:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.title.trim()) {
      setError('Title is required')
      return
    }

    if (!formData.communityId) {
      setError('Please select a community')
      return
    }

    if (postType === 'text' && !formData.content.trim()) {
      setError('Content is required for text posts')
      return
    }

    if (postType === 'link' && !formData.linkUrl.trim()) {
      setError('Link URL is required for link posts')
      return
    }

    if (postType === 'image' && !formData.imageUrl.trim()) {
      setError('Image URL is required for image posts')
      return
    }

    setLoading(true)

    try {
      const payload: any = {
        title: formData.title,
        communityId: formData.communityId,
      }

      if (postType === 'text') {
        payload.content = formData.content
      } else if (postType === 'link') {
        payload.linkUrl = formData.linkUrl
      } else if (postType === 'image') {
        payload.imageUrl = formData.imageUrl
      }

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create post')
      } else {
        const community = communities.find((c) => c.id === formData.communityId)
        router.push(`/r/${community?.name}/post/${data.id}`)
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
            <CardTitle>Create Post</CardTitle>
            <CardDescription>Share something with the community</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="community" className="text-sm font-medium">
                  Community
                </label>
                <select
                  id="community"
                  value={formData.communityId}
                  onChange={(e) => setFormData({ ...formData, communityId: e.target.value })}
                  className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="">Select a community</option>
                  {communities.map((community) => (
                    <option key={community.id} value={community.id}>
                      r/{community.name}
                    </option>
                  ))}
                </select>
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
                  maxLength={300}
                  className="mt-1"
                />
              </div>

              <div>
                <div className="flex space-x-2 mb-2">
                  <Button
                    type="button"
                    variant={postType === 'text' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPostType('text')}
                  >
                    Text
                  </Button>
                  <Button
                    type="button"
                    variant={postType === 'link' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPostType('link')}
                  >
                    Link
                  </Button>
                  <Button
                    type="button"
                    variant={postType === 'image' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPostType('image')}
                  >
                    Image
                  </Button>
                </div>

                {postType === 'text' && (
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Text (optional)"
                    rows={10}
                    maxLength={40000}
                  />
                )}

                {postType === 'link' && (
                  <Input
                    type="url"
                    value={formData.linkUrl}
                    onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                    placeholder="https://example.com"
                  />
                )}

                {postType === 'image' && (
                  <Input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                )}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating post...' : 'Post'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function CreatePostPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-6">Loading...</div>
      </div>
    }>
      <CreatePostForm />
    </Suspense>
  )
}

