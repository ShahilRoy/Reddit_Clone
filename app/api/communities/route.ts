import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const communitySchema = z.object({
  name: z.string().min(3).max(21).regex(/^[a-z0-9_]+$/),
  title: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
})

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = parseInt(searchParams.get('skip') || '0')

    const communities = await prisma.community.findMany({
      where: {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { title: { contains: search, mode: 'insensitive' } },
        ],
      },
      include: {
        _count: {
          select: {
            posts: true,
            subscriptions: true,
          },
        },
      },
      take: limit,
      skip,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(communities)
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
    const validatedData = communitySchema.parse(body)

    // Check if community name already exists
    const existing = await prisma.community.findUnique({
      where: { name: validatedData.name },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Community name already exists' },
        { status: 400 }
      )
    }

    const community = await prisma.community.create({
      data: {
        ...validatedData,
        creatorId: session.user.id,
      },
      include: {
        creator: {
          select: {
            id: true,
            username: true,
            name: true,
          },
        },
        _count: {
          select: {
            posts: true,
            subscriptions: true,
          },
        },
      },
    })

    // Subscribe creator to their own community
    await prisma.subscription.create({
      data: {
        userId: session.user.id,
        communityId: community.id,
      },
    })

    return NextResponse.json(community, { status: 201 })
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

