import { FastifyReply, FastifyRequest } from 'fastify'
import AppError from '../../app-error'
import { UNAUTHORIZED } from '../../utils/http-status-code'
import { prisma } from '../config/prisma'

interface Decoded {
  sign: {
    sub: string
    session: string
  }
  iat: number
  exp: number
}

export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
  // Public routes
  const paths = [
    { method: 'POST', path: '/users' },
    { method: 'POST', path: '/users/auth' },
  ]

  for (const path of paths) {
    if (
      request.routerMethod === path.method &&
      request.routerPath === path.path
    ) {
      return
    }
  }

  // Swagger URL
  if (
    request?.routerPath &&
    request.method === 'GET' &&
    request.routerPath.includes('/docs')
  ) {
    return
  }

  // Photos URL
  if (request.url.includes('/tmp/') || request.url.includes('/favicon.ico')) {
    return
  }

  // Verify JWT
  try {
    const decoded: Decoded = await request.jwtVerify()

    const session = await prisma.session.findUnique({
      where: { id: decoded.sign.session },
    })

    if (!session || session.revoked_at) {
      throw new AppError('Unathorized session')
    }

    request.sign = decoded.sign
  } catch (err) {
    return reply.status(UNAUTHORIZED).send({ message: 'Unauthorized.' })
  }
}
