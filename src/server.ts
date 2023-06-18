import 'dotenv/config'
import { app } from './app'

const port = Number(process.env.PORT) || 3333

app
  .listen({
    host: '0.0.0.0',
    port,
  })
  .then(() => {
    console.log('🚀 HTTP Server Running in port ' + port)
  })
