'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { formatTimeAgo } from '@/lib/utils'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Card, CardContent } from './ui/card'
import { ArrowUp, ArrowDown, MessageSquare } from 'lucide-react'

interface Comment {
  id: string
  content: string
  createdAt: string
  score: number
  userVote: 'UP' | 'DOWN' | null
  author: {
    username: string | null
    name: string | null
  }
  replies: Comment[]
  _count: {
    replies: number
  }
}

interface CommentSectionProps {
  postId: string
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { data: session } = useSession()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchComments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId])

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?postId=${postId}`)
      if (response.ok) {
        const data = await response.json()
        setComments(data)
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitComment = async () => {
    if (!session || !newComment.trim()) return

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newComment,
          postId,
        }),
      })

      if (response.ok) {
        setNewComment('')
        fetchComments()
      }
    } catch (error) {
      console.error('Error posting comment:', error)
    }
  }

  const handleSubmitReply = async (parentId: string) => {
    if (!session || !replyContent.trim()) return

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: replyContent,
          postId,
          parentId,
        }),
      })

      if (response.ok) {
        setReplyContent('')
        setReplyingTo(null)
        fetchComments()
      }
    } catch (error) {
      console.error('Error posting reply:', error)
    }
  }

  const handleVote = async (commentId: string, currentVote: 'UP' | 'DOWN' | null, currentScore: number) => {
    if (!session) {
      window.location.href = '/login'
      return
    }

    const type = currentVote === 'UP' ? 'DOWN' : 'UP'

    try {
      const response = await fetch(`/api/comments/${commentId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      })

      if (response.ok) {
        fetchComments()
      }
    } catch (error) {
      console.error('Error voting:', error)
    }
  }

  const CommentItem = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => {
    const [isVoting, setIsVoting] = useState(false)

    return (
      <div className={`${depth > 0 ? 'ml-8 mt-2' : ''}`}>
        <Card className="mb-2">
          <CardContent className="p-4">
            <div className="flex">
              <div className="flex flex-col items-center mr-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => {
                    setIsVoting(true)
                    handleVote(comment.id, comment.userVote, comment.score).finally(() => setIsVoting(false))
                  }}
                  disabled={isVoting}
                >
                  <ArrowUp
                    className={`h-3 w-3 ${
                      comment.userVote === 'UP' ? 'text-orange-500' : ''
                    }`}
                  />
                </Button>
                <span className="text-xs font-medium">{comment.score}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => {
                    setIsVoting(true)
                    handleVote(comment.id, comment.userVote === 'DOWN' ? 'UP' : 'DOWN', comment.score).finally(() => setIsVoting(false))
                  }}
                  disabled={isVoting}
                >
                  <ArrowDown
                    className={`h-3 w-3 ${
                      comment.userVote === 'DOWN' ? 'text-blue-500' : ''
                    }`}
                  />
                </Button>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-1">
                  <span>u/{comment.author.username}</span>
                  <span>•</span>
                  <span>{formatTimeAgo(new Date(comment.createdAt))}</span>
                </div>
                <p className="text-sm mb-2">{comment.content}</p>
                {session && depth < 3 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  >
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Reply
                  </Button>
                )}
                {replyingTo === comment.id && (
                  <div className="mt-2">
                    <Textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="What are your thoughts?"
                      className="mb-2"
                    />
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleSubmitReply(comment.id)}
                      >
                        Reply
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setReplyingTo(null)
                          setReplyContent('')
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        {comment.replies && comment.replies.length > 0 && (
          <div>
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return <div>Loading comments...</div>
  }

  return (
    <div className="mt-6">
      {session ? (
        <div className="mb-6">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="What are your thoughts?"
            className="mb-2"
          />
          <Button onClick={handleSubmitComment}>Comment</Button>
        </div>
      ) : (
        <div className="mb-6 p-4 border rounded-md">
          <p className="text-sm mb-2">Log in or sign up to leave a comment</p>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => window.location.href = '/login'}>
              Log In
            </Button>
            <Button onClick={() => window.location.href = '/register'}>
              Sign Up
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {comments.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  )
}

