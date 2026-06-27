import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { transactionsRouter } from './routes/transactions'
import { ideasRouter } from './routes/ideas'
import wishlistRouter from './routes/wishlist'
import archivesRouter from './routes/archives'

import accountsRouter from './routes/accounts'
import categoriesRouter from './routes/categories'
import dashboardRouter from './routes/dashboard'
import lendingRouter from './routes/lending'
import investmentsRouter from './routes/investments'

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
app.route('/api/v1/wishlist', wishlistRouter)
app.route('/api/v1/archives', archivesRouter)
app.route('/api/v1/accounts', accountsRouter)
app.route('/api/v1/categories', categoriesRouter)
app.route('/api/v1/dashboard', dashboardRouter)
app.route('/api/v1/lending', lendingRouter)
app.route('/api/v1/investments', investmentsRouter)

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
