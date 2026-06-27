import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { transactionsRouter } from './routes/transactions'
import { ideasRouter } from './routes/ideas'

const app = new Hono()

// Global middleware
app.use('*', cors())

// Root healthcheck
app.get('/', (c) => {
  return c.text('Save-It-Here API is running!')
})

// Mount v1 routes
app.route('/api/v1/transactions', transactionsRouter)
app.route('/api/v1/ideas', ideasRouter)

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
