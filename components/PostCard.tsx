'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { formatTimeAgo } from '@/lib/utils'
import { Card, CardContent, CardHeader } from './ui/card'
import { Button } from './ui/button'
import { ArrowUp, ArrowDown, MessageCircle } from 'lucide-react'
import { useState } from 'react'

interface PostCardProps {
  post: {
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
}

export function PostCard({ post }: PostCardProps) {
  const { data: session } = useSession()
  const [score, setScore] = useState(post.score)
  const [userVote, setUserVote] = useState(post.userVote)
  const [isVoting, setIsVoting] = useState(false)

  const handleVote = async (type: 'UP' | 'DOWN') => {
    if (!session) {
      window.location.href = '/login'
      return
    }

    setIsVoting(true)
    try {
      const response = await fetch(`/api/posts/${post.id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      })

      const data = await response.json()

      if (response.ok) {
        if (data.type === null) {
          // Vote removed
          if (userVote === 'UP') setScore(score - 1)
          else if (userVote === 'DOWN') setScore(score + 1)
          setUserVote(null)
        } else {
          // Vote changed or added
          if (userVote === null) {
            setScore(data.type === 'UP' ? score + 1 : score - 1)
          } else if (userVote === 'UP' && data.type === 'DOWN') {
            setScore(score - 2)
          } else if (userVote === 'DOWN' && data.type === 'UP') {
            setScore(score + 2)
          }
          setUserVote(data.type)
        }
      }
    } catch (error) {
      console.error('Error voting:', error)
    } finally {
      setIsVoting(false)
    }
  }

  return (
    <Card className="mb-4">
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
              className="h-8 w-8"
              onClick={() => handleVote('UP')}
              disabled={isVoting}
            >
              <ArrowUp
                className={`h-4 w-4 ${
                  userVote === 'UP' ? 'text-orange-500' : ''
                }`}
              />
            </Button>
            <span className="text-sm font-medium">{score}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleVote('DOWN')}
              disabled={isVoting}
            >
              <ArrowDown
                className={`h-4 w-4 ${
                  userVote === 'DOWN' ? 'text-blue-500' : ''
                }`}
              />
            </Button>
          </div>
          <div className="flex-1">
            <Link href={`/r/${post.community.name}/post/${post.id}`}>
              <h3 className="text-lg font-semibold mb-2 hover:underline">
                {post.title}
              </h3>
            </Link>
            {post.content && (
              <p className="text-sm text-muted-foreground mb-2 line-clamp-3">
                {post.content}
              </p>
            )}
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt={post.title}
                className="max-h-96 w-full object-contain rounded-md mb-2"
              />
            )}
            {post.linkUrl && (
              <a
                href={post.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline"
              >
                {post.linkUrl}
              </a>
            )}
            <div className="flex items-center space-x-4 mt-3">
              <Link
                href={`/r/${post.community.name}/post/${post.id}`}
                className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <MessageCircle className="h-4 w-4" />
                <span>{post._count.comments} comments</span>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

