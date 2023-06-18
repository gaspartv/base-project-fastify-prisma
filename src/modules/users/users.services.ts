import { User } from '@prisma/client'
import { hashSync } from 'bcrypt'
import { randomUUID } from 'crypto'
import { FastifyReply } from 'fastify'
import AppError from '../../app-error'
import { UsersMiddleware } from './users.middlewares'
import { UsersRepository } from './users.repository'
import {
  UsersCreateBodyDto,
  UsersLoginBodyDto,
  UsersTokenResponseDto,
} from './users.schema'

export class UsersService {
  constructor(private repository: UsersRepository) {}

  async all(): Promise<User[]> {
    return await this.repository.findAll()
  }

  async auth(
    data: UsersLoginBodyDto,
    reply: FastifyReply
  ): Promise<UsersTokenResponseDto> {
    const user = await new UsersMiddleware(this.repository).auth(data)
    const token = await reply.jwtSign({ sub: user.id }, { expiresIn: '1d' })
    await this.repository.session(user.id, token,`Login successful ${new Date()}`)
    return { token }
  }

  async create(data: UsersCreateBodyDto): Promise<void> {
    await new UsersMiddleware(this.repository).create(data)
    const password = randomUUID().toString()
    console.log(password)
    await this.repository.create({ ...data, password: hashSync(password, 10) })
    return
  }

  async findOne(where: string): Promise<User | AppError> {
    return await new UsersMiddleware(this.repository).findOne(where)
  }
}
