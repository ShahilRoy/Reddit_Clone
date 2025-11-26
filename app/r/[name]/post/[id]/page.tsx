'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { CommentSection } from '@/components/CommentSection'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useSession } from 'next-auth/react'
import { formatTimeAgo } from '@/lib/utils'
import { ArrowUp, ArrowDown, MessageCircle } from 'lucide-react'
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

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const postId = params.id as string
  const { data: session } = useSession()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [isVoting, setIsVoting] = useState(false)

  useEffect(() => {
    if (postId) {
      fetchPost()
    }
  }, [postId])

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}`)
      if (response.ok) {
        const data = await response.json()
        setPost(data)
      }
    } catch (error) {
      console.error('Error fetching post:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (type: 'UP' | 'DOWN') => {
    if (!session) {
      window.location.href = '/login'
      return
    }

    setIsVoting(true)
    try {
      const response = await fetch(`/api/posts/${postId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      })

      const data = await response.json()

      if (response.ok && post) {
        let newScore = post.score
        let newUserVote = post.userVote

        if (data.type === null) {
          // Vote removed
          if (post.userVote === 'UP') newScore = post.score - 1
          else if (post.userVote === 'DOWN') newScore = post.score + 1
          newUserVote = null
        } else {
          // Vote changed or added
          if (post.userVote === null) {
            newScore = data.type === 'UP' ? post.score + 1 : post.score - 1
          } else if (post.userVote === 'UP' && data.type === 'DOWN') {
            newScore = post.score - 2
          } else if (post.userVote === 'DOWN' && data.type === 'UP') {
            newScore = post.score + 2
          }
          newUserVote = data.type
        }

        setPost({ ...post, score: newScore, userVote: newUserVote })
      }
    } catch (error) {
      console.error('Error voting:', error)
    } finally {
      setIsVoting(false)
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

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Post not found</h1>
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
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Link href={`/r/${post.community.name}`} className="hover:underline">
                r/{post.community.name}
              </Link>
              <span>•</span>
              <span>Posted by u/{post.author.username}</span>
              <span>•</span>
              <span>{formatTimeAgo(new Date(post.createdAt))}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex">
              <div className="flex flex-col items-center mr-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => handleVote('UP')}
                  disabled={isVoting}
                >
                  <ArrowUp
                    className={`h-5 w-5 ${
                      post.userVote === 'UP' ? 'text-orange-500' : ''
                    }`}
                  />
                </Button>
                <span className="text-lg font-medium">{post.score}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => handleVote('DOWN')}
                  disabled={isVoting}
                >
                  <ArrowDown
                    className={`h-5 w-5 ${
                      post.userVote === 'DOWN' ? 'text-blue-500' : ''
                    }`}
                  />
                </Button>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
                {post.content && (
                  <div className="prose max-w-none mb-4">
                    <p className="whitespace-pre-wrap">{post.content}</p>
                  </div>
                )}
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="max-h-96 w-full object-contain rounded-md mb-4"
                  />
                )}
                {post.linkUrl && (
                  <a
                    href={post.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline block mb-4"
                  >
                    {post.linkUrl}
                  </a>
                )}
                <div className="flex items-center space-x-4 mt-4">
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <MessageCircle className="h-4 w-4" />
                    <span>{post._count.comments} comments</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <CommentSection postId={postId} />
      </div>
    </div>
  )
}

