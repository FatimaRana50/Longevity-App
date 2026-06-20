import express from 'express'
import cors from 'cors'

import questionsRouter from './routes/questions'
import choicesRouter from './routes/choices'
import journalRouter from './routes/journal'
import profileRouter from './routes/profile'
import billingRouter from './routes/billing'
import insightsRouter from './routes/insights'
import streaksRouter from './routes/streaks'
import couplesRouter from './routes/couples'

const app = express()

const origins = (process.env.ALLOWED_ORIGINS ?? 'http://localhost:3000').split(',')
app.use(cors({ origin: origins, credentials: true }))

// Raw body for Stripe webhook (must come before express.json)
app.use('/api/billing/webhook', express.raw({ type: 'application/json' }))

app.use(express.json())

// Routes
app.use('/api/questions', questionsRouter)
app.use('/api/choices',   choicesRouter)
app.use('/api/journal',   journalRouter)
app.use('/api/profile',   profileRouter)
app.use('/api/billing',   billingRouter)
app.use('/api/insights',  insightsRouter)
app.use('/api/streaks',   streaksRouter)
app.use('/api/couples',   couplesRouter)

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok' }))

// 404
app.use((_req, res) => res.status(404).json({ data: null, error: { message: 'Not found' } }))

export default app
