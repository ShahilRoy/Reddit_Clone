import { compare, hash } from 'bcryptjs'
import { prisma } from './prisma'

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword)
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  })
}

export async function getUserByUsername(username: string) {
  return prisma.user.findUnique({
    where: { username },
  })
}

export async function createUser(data: {
  email: string
  password: string
  username: string
  name?: string
}) {
  const hashedPassword = await hashPassword(data.password)
  return prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      username: data.username,
      name: data.name || data.username,
    },
  })
}

