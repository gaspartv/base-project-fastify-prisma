import { FastifyInstance } from 'fastify'
import { UsersController } from './users.controllers'

export async function usersRoutes(app: FastifyInstance): Promise<void> {
  app.get('', UsersController.all)
  app.get('/:where', UsersController.findOne)

  app.post('', UsersController.create)
  app.post('/auth', UsersController.auth)
}
