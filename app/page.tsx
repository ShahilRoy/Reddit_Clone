'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/Header'
import { PostCard } from '@/components/PostCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { TrendingUp } from 'lucide-react'

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
  _count: {
    posts: number
    subscriptions: number
  }
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([])
  const [communities, setCommunities] = useState<Community[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
    fetchCommunities()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      if (response.ok) {
        const data = await response.json()
        setPosts(data)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCommunities = async () => {
    try {
      const response = await fetch('/api/communities?limit=5')
      if (response.ok) {
        const data = await response.json()
        setCommunities(data)
      }
    } catch (error) {
      console.error('Error fetching communities:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {loading ? (
              <div>Loading posts...</div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No posts yet</p>
                <Link href="/create-post">
                  <Button>Create your first post</Button>
                </Link>
              </div>
            ) : (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Top Communities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {communities.map((community) => (
                    <Link
                      key={community.id}
                      href={`/r/${community.name}`}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-accent"
                    >
                      <div>
                        <div className="font-medium">r/{community.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {community._count.subscriptions} members
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link href="/create-community" className="block mt-4">
                  <Button variant="outline" className="w-full">
                    Create Community
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

