import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import conversationRoutes from './routes/conversations.js'
import parkingLotRoutes from './routes/parking-lot.js'
import newsfeedRoutes from './routes/newsfeed.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// Initialize Supabase
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/conversations', conversationRoutes)
app.use('/api/parking-lot', parkingLotRoutes)
app.use('/api/newsfeed', newsfeedRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
