import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { usersResponseSchema } from '../../global/dtos/users.dto'
import { paramsWhereExtract } from '../../utils/params-extract'
import { makeUsersService } from './users.factory'
import {
  UsersLoginBodyDto,
  UsersTokenResponseDto,
  usersCreateBodySchema,
  usersLoginBodySchema,
  usersTokenResponseSchema,
} from './users.schema'

export class UsersController {
  static async create(req: FastifyRequest, reply: FastifyReply) {
    const body = usersCreateBodySchema.parse(req.body)
    await makeUsersService().create(body)
    return reply.status(201).send({ message: 'User created successfully' })
  }

  static async auth(req: FastifyRequest, reply: FastifyReply) {
    const body: UsersLoginBodyDto = usersLoginBodySchema.parse(req.body)
    const token: UsersTokenResponseDto = await makeUsersService().auth(
      body,
      reply
    )
    return reply.status(200).send(usersTokenResponseSchema.parse(token))
  }

  static async all(req: FastifyRequest, reply: FastifyReply) {
    const users = await makeUsersService().all()
    return reply.status(200).send(z.array(usersResponseSchema).parse(users))
  }

  static async findOne(req: FastifyRequest, reply: FastifyReply) {
    const where = paramsWhereExtract(req.params)
    const user = await makeUsersService().findOne(where)
    return reply.status(200).send(usersResponseSchema.parse(user))
  }
}
