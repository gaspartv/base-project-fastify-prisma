import fastifyCookie from '@fastify/cookie'
import cors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifyRateLimit from '@fastify/rate-limit'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastify from 'fastify'
import { ZodError } from 'zod'
import AppError from './app-error'
import { verifyJwt } from './global/middlewares/verify-jwt'
import { usersRoutes } from './modules/users/users.routes'
import { INTERNAL_SERVER_ERROR, TEAPOT } from './utils/http-status-code'

export const app = fastify()

app.setValidatorCompiler((_) => async (data) => ({ value: data }))
app.setSerializerCompiler((_) => (data) => JSON.stringify(data))

app.register(cors)

app.register(fastifyRateLimit, {
  max: 100,
  timeWindow: '1 minute',
  onExceeded: (req, res) => {
    throw new AppError('Rate limit exceeded', 429)
  },
})

app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET!,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '1d',
  },
})

app.register(fastifyCookie)

app.register(fastifySwagger, {
  swagger: {
    info: {
      title: 'API MIT Auth',
      description: 'API for authentication and authorization of MIT',
      version: '1.0.0',
    },
    securityDefinitions: {
      Bearer: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
    },
    security: [{ Bearer: [] }],
  },
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false,
  },
  uiHooks: {
    onRequest: function (req, reply, next) {
      next()
    },
    preHandler: function (req, reply, next) {
      next()
    },
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject, req, reply) => {
    return swaggerObject
  },
  transformSpecificationClone: true,
})

app.addHook('onRequest', verifyJwt)

app.register(usersRoutes, { prefix: '/users' })

app.setErrorHandler((error, _, reply) => {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      message: error.message,
    })
  }

  if (error instanceof ZodError) {
    return reply.status(TEAPOT).send({
      message: 'Validation error.',
      issues: error.flatten().fieldErrors,
    })
  }

  if (error instanceof SyntaxError) {
    return reply.status(TEAPOT).send({ message: 'JSON syntax error.' })
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(error.constructor.name)
    console.error(error)
  }

  return reply
    .status(INTERNAL_SERVER_ERROR)
    .send({ message: 'Internal server error.' })
})
