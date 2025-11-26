import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const voteSchema = z.object({
  type: z.enum(['UP', 'DOWN']),
})

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { type } = voteSchema.parse(body)

    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_commentId: {
          userId: session.user.id,
          commentId: params.id,
        },
      },
    })

    if (existingVote) {
      if (existingVote.type === type) {
        // Remove vote if clicking same type
        await prisma.vote.delete({
          where: {
            userId_commentId: {
              userId: session.user.id,
              commentId: params.id,
            },
          },
        })
        return NextResponse.json({ type: null })
      } else {
        // Update vote
        const updated = await prisma.vote.update({
          where: {
            userId_commentId: {
              userId: session.user.id,
              commentId: params.id,
            },
          },
          data: { type },
        })
        return NextResponse.json({ type: updated.type })
      }
    } else {
      // Create new vote
      const vote = await prisma.vote.create({
        data: {
          type,
          userId: session.user.id,
          commentId: params.id,
        },
      })
      return NextResponse.json({ type: vote.type })
    }
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

