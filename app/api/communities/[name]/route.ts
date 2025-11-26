import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const community = await prisma.community.findUnique({
      where: { name: params.name },
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

    if (!community) {
      return NextResponse.json(
        { error: 'Community not found' },
        { status: 404 }
      )
    }

    let isSubscribed = false
    if (session?.user) {
      const subscription = await prisma.subscription.findUnique({
        where: {
          userId_communityId: {
            userId: session.user.id,
            communityId: community.id,
          },
        },
      })
      isSubscribed = !!subscription
    }

    return NextResponse.json({ ...community, isSubscribed })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

