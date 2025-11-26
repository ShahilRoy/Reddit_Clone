'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Header } from '@/components/Header'
import { PostCard } from '@/components/PostCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

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

interface User {
  id: string
  username: string | null
  name: string | null
  createdAt: string
}

export default function UserProfilePage() {
  const params = useParams()
  const username = params.username as string
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (username) {
      fetchUser()
      fetchPosts()
    }
  }, [username])

  const fetchUser = async () => {
    try {
      // Since we don't have a user API endpoint, we'll fetch posts and get user info from there
      // In a real app, you'd have a dedicated user endpoint
      const response = await fetch(`/api/posts`)
      if (response.ok) {
        const data = await response.json()
        const userPost = data.find((p: Post) => p.author.username === username)
        if (userPost) {
          setUser({
            id: userPost.author.username || '',
            username: userPost.author.username,
            name: userPost.author.name,
            createdAt: userPost.createdAt,
          })
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      if (response.ok) {
        const data = await response.json()
        const userPosts = data.filter((p: Post) => p.author.username === username)
        setPosts(userPosts)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
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

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">User not found</h1>
            <Link href="/">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
                Go Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>u/{user.username}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-muted-foreground">Name: </span>
                <span>{user.name || 'N/A'}</span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Member since: </span>
                <span>{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Posts: </span>
                <span>{posts.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-xl font-semibold mb-4">Posts</h2>
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No posts yet</p>
            </div>
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </div>
    </div>
  )
}

