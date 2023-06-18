import '@fastify/jwt'

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    sign: {
      sub: string
      session: string
    }
  }
}
