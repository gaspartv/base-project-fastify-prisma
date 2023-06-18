import { User } from '@prisma/client'
import { prisma } from '../../global/config/prisma'
import { UsersCreateBodyDto } from './users.schema'

interface UsersCreateBodyPasswordDot extends UsersCreateBodyDto {
  password: string
}

export interface UsersRepository {
  create(data: UsersCreateBodyPasswordDot): Promise<User>
  findById(email: string): Promise<User | null>
  findByEmail(email: string): Promise<User | null>
  findByLogin(login: string): Promise<User | null>
  findByPhone(phone: string): Promise<User | null>
  findAll(): Promise<User[]>
  session(userId: string, token: string, description: string): Promise<User>
}

export class UsersRepositoryPrisma implements UsersRepository {
  async create(data: UsersCreateBodyPasswordDot): Promise<User> {
    return await prisma.user.create({
      data: {
        ...data,
        session: {
          create: {
            session_logs: {
              create: {
                description: `User create ${new Date()}`,
              },
            },
          },
        },
      },
    })
  }

  async findById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { id } })
  }

  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { email } })
  }

  async findByLogin(login: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { login } })
  }

  async findByPhone(phone: string): Promise<User | null> {
    return await prisma.user.findUnique({ where: { phone } })
  }

  async findAll(): Promise<User[]> {
    return await prisma.user.findMany()
  }

  async session(
    userId: string,
    token: string,
    description: string
  ): Promise<User> {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        session: {
          update: {
            token,
            session_logs: {
              create: {
                description,
              },
            },
          },
        },
      },
    })
  }
}
