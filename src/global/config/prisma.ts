import { PrismaClient } from '@prisma/client'
import { FastifyInstance } from 'fastify'

class PrismaService extends PrismaClient {
  async enableShutdownHooks(app: FastifyInstance) {
    this.$on('beforeExit', async () => {
      await app.close()
    })
  }
}

export const prisma = new PrismaService()
