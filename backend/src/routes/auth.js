import express from 'express'
import bcrypt from 'bcryptjs'
import { supabase } from '../index.js'

const router = express.Router()

// Initialize password on first run (or update via environment variable)
const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD || 'changeme'
let hashedPassword = null

async function initializePassword() {
  if (!hashedPassword) {
    hashedPassword = await bcrypt.hash(DASHBOARD_PASSWORD, 10)
  }
}

initializePassword()

router.post('/login', async (req, res) => {
  try {
    const { password } = req.body

    if (!password) {
      return res.status(400).json({ success: false, message: 'Password required' })
    }

    await initializePassword()
    const passwordMatch = await bcrypt.compare(password, hashedPassword)

    if (passwordMatch) {
      return res.json({ success: true })
    } else {
      return res.status(401).json({ success: false, message: 'Invalid password' })
    }
  } catch (error) {
    console.error('Auth error:', error)
    res.status(500).json({ success: false, message: 'Server error' })
  }
})

export default router
