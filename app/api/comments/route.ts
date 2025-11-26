import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const commentSchema = z.object({
  content: z.string().min(1).max(10000),
  postId: z.string(),
  parentId: z.string().optional(),
})

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const searchParams = req.nextUrl.searchParams
    const postId = searchParams.get('postId')

    if (!postId) {
      return NextResponse.json(
        { error: 'postId is required' },
        { status: 400 }
      )
    }

    const comments = await prisma.comment.findMany({
      where: {
        postId,
        parentId: null, // Only top-level comments
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            replies: true,
            votes: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Get user votes if logged in
    let userVotes: Record<string, 'UP' | 'DOWN'> = {}
    if (session?.user) {
      const votes = await prisma.vote.findMany({
        where: {
          userId: session.user.id,
          commentId: { in: comments.map((c) => c.id) },
        },
      })
      votes.forEach((vote) => {
        userVotes[vote.commentId!] = vote.type
      })
    }

    // Calculate scores and get replies
    const commentsWithScores = await Promise.all(
      comments.map(async (comment) => {
        const votes = await prisma.vote.findMany({
          where: { commentId: comment.id },
        })
        const score = votes.reduce((acc, vote) => {
          return acc + (vote.type === 'UP' ? 1 : -1)
        }, 0)

        // Get replies
        const replies = await prisma.comment.findMany({
          where: { parentId: comment.id },
          include: {
            author: {
              select: {
                id: true,
                username: true,
                name: true,
                image: true,
              },
            },
            _count: {
              select: {
                replies: true,
                votes: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        })

        // Get reply votes
        let replyVotes: Record<string, 'UP' | 'DOWN'> = {}
        if (session?.user && replies.length > 0) {
          const replyVotesData = await prisma.vote.findMany({
            where: {
              userId: session.user.id,
              commentId: { in: replies.map((r) => r.id) },
            },
          })
          replyVotesData.forEach((vote) => {
            replyVotes[vote.commentId!] = vote.type
          })
        }

        const repliesWithScores = await Promise.all(
          replies.map(async (reply) => {
            const replyVotesData = await prisma.vote.findMany({
              where: { commentId: reply.id },
            })
            const replyScore = replyVotesData.reduce((acc, vote) => {
              return acc + (vote.type === 'UP' ? 1 : -1)
            }, 0)
            return {
              ...reply,
              score: replyScore,
              userVote: replyVotes[reply.id] || null,
            }
          })
        )

        return {
          ...comment,
          score,
          userVote: userVotes[comment.id] || null,
          replies: repliesWithScores,
        }
      })
    )

    return NextResponse.json(commentsWithScores)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = commentSchema.parse(body)

    // Verify post exists
    const post = await prisma.post.findUnique({
      where: { id: validatedData.postId },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // If parentId is provided, verify it exists
    if (validatedData.parentId) {
      const parent = await prisma.comment.findUnique({
        where: { id: validatedData.parentId },
      })
      if (!parent) {
        return NextResponse.json(
          { error: 'Parent comment not found' },
          { status: 404 }
        )
      }
    }

    const comment = await prisma.comment.create({
      data: {
        ...validatedData,
        authorId: session.user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            replies: true,
            votes: true,
          },
        },
      },
    })

    return NextResponse.json({ ...comment, score: 0, userVote: null }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

