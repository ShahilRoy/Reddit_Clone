'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Header } from '@/components/Header'
import { PostCard } from '@/components/PostCard'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Users } from 'lucide-react'

interface Post {
  id: string
  title: string
  content?: string | null
  imageUrl?: string | null
  linkUrl?: string | null
  createdAt: string
  score: number
  userVote: 'UP' | 'DOWN' | null
  author: {
    username: string | null
    name: string | null
  }
  community: {
    name: string
    title: string
  }
  _count: {
    comments: number
  }
}

interface Community {
  id: string
  name: string
  title: string
  description?: string | null
  isSubscribed: boolean
  _count: {
    posts: number
    subscriptions: number
  }
}

export default function CommunityPage() {
  const params = useParams()
  const communityName = params.name as string
  const { data: session } = useSession()
  const [community, setCommunity] = useState<Community | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubscribing, setIsSubscribing] = useState(false)

  useEffect(() => {
    if (communityName) {
      fetchCommunity()
    }
  }, [communityName])

  const fetchCommunity = async () => {
    try {
      const response = await fetch(`/api/communities/${communityName}`)
      if (response.ok) {
        const data = await response.json()
        setCommunity(data)
        // Fetch posts after community is loaded
        fetchPosts(data.id)
      } else {
        setLoading(false)
      }
    } catch (error) {
      console.error('Error fetching community:', error)
      setLoading(false)
    }
  }

  const fetchPosts = async (communityId?: string) => {
    try {
      const id = communityId || community?.id
      if (id) {
        const response = await fetch(`/api/posts?communityId=${id}`)
        if (response.ok) {
          const data = await response.json()
          setPosts(data)
        }
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async () => {
    if (!session) {
      window.location.href = '/login'
      return
    }

    setIsSubscribing(true)
    try {
      const response = await fetch(`/api/communities/${communityName}/subscribe`, {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        setCommunity((prev) => prev ? { ...prev, isSubscribed: data.subscribed } : null)
      }
    } catch (error) {
      console.error('Error subscribing:', error)
    } finally {
      setIsSubscribing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-6">Loading...</div>
      </div>
    )
  }

  if (!community) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Community not found</h1>
            <Link href="/">
              <Button>Go Home</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>r/{community.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {community.description || 'No description'}
                    </CardDescription>
                  </div>
                  {session && (
                    <Button
                      onClick={handleSubscribe}
                      disabled={isSubscribing}
                      variant={community.isSubscribed ? 'outline' : 'default'}
                    >
                      {community.isSubscribed ? 'Joined' : 'Join'}
                    </Button>
                  )}
                </div>
              </CardHeader>
            </Card>

            {session && (
              <Card className="mb-6">
                <CardContent className="p-4">
                  <Link href={`/create-post?community=${communityName}`}>
                    <Button className="w-full">Create Post</Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No posts yet</p>
                {session && (
                  <Link href={`/create-post?community=${communityName}`}>
                    <Button>Create the first post</Button>
                  </Link>
                )}
              </div>
            ) : (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>About Community</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{community._count.subscriptions}</div>
                      <div className="text-sm text-muted-foreground">Members</div>
                    </div>
                  </div>
                  <div>
                    <div className="font-medium">{community._count.posts}</div>
                    <div className="text-sm text-muted-foreground">Posts</div>
                  </div>
                  {session && (
                    <Button
                      onClick={handleSubscribe}
                      disabled={isSubscribing}
                      variant={community.isSubscribed ? 'outline' : 'default'}
                      className="w-full"
                    >
                      {community.isSubscribed ? 'Leave' : 'Join'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

