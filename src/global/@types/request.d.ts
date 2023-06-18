import '@fastify'

declare module 'fastify' {
  export interface FastifyRequest {
    sign: {
      sub: string
      session: string
    }
  }
}
