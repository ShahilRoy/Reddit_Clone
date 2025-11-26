import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const postSchema = z.object({
  title: z.string().min(1).max(300),
  content: z.string().max(40000).optional(),
  imageUrl: z.string().url().optional(),
  linkUrl: z.string().url().optional(),
  communityId: z.string(),
})

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const searchParams = req.nextUrl.searchParams
    const communityId = searchParams.get('communityId')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = parseInt(searchParams.get('skip') || '0')

    const where = communityId ? { communityId } : {}

    const posts = await prisma.post.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            image: true,
          },
        },
        community: {
          select: {
            id: true,
            name: true,
            title: true,
          },
        },
        _count: {
          select: {
            comments: true,
            votes: true,
          },
        },
      },
      take: limit,
      skip,
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
          postId: { in: posts.map((p) => p.id) },
        },
      })
      votes.forEach((vote) => {
        userVotes[vote.postId!] = vote.type
      })
    }

    // Calculate vote scores
    const postsWithScores = await Promise.all(
      posts.map(async (post) => {
        const votes = await prisma.vote.findMany({
          where: { postId: post.id },
        })
        const score = votes.reduce((acc, vote) => {
          return acc + (vote.type === 'UP' ? 1 : -1)
        }, 0)

        return {
          ...post,
          score,
          userVote: userVotes[post.id] || null,
        }
      })
    )

    return NextResponse.json(postsWithScores)
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
    const validatedData = postSchema.parse(body)

    // Verify community exists
    const community = await prisma.community.findUnique({
      where: { id: validatedData.communityId },
    })

    if (!community) {
      return NextResponse.json(
        { error: 'Community not found' },
        { status: 404 }
      )
    }

    const post = await prisma.post.create({
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
        community: {
          select: {
            id: true,
            name: true,
            title: true,
          },
        },
        _count: {
          select: {
            comments: true,
            votes: true,
          },
        },
      },
    })

    return NextResponse.json({ ...post, score: 0, userVote: null }, { status: 201 })
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

