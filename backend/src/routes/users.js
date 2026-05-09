import express from 'express'
import { supabase } from '../index.js'

const router = express.Router()

// Get all users
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('name')

    if (error) throw error
    res.json(data)
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ error: error.message })
  }
})

// Get single user
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (error) throw error
    res.json(data)
  } catch (error) {
    console.error('Error fetching user:', error)
    res.status(500).json({ error: error.message })
  }
})

// Create user
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, company, role, location_lat, location_lng } = req.body

    const { data, error } = await supabase
      .from('users')
      .insert([{
        name,
        email,
        phone,
        company,
        role,
        location_lat,
        location_lng,
        created_at: new Date().toISOString()
      }])
      .select()

    if (error) throw error
    res.json(data[0])
  } catch (error) {
    console.error('Error creating user:', error)
    res.status(500).json({ error: error.message })
  }
})

// Update user
router.put('/:id', async (req, res) => {
  try {
    const { name, email, phone, company, role, location_lat, location_lng } = req.body

    const { data, error } = await supabase
      .from('users')
      .update({
        name,
        email,
        phone,
        company,
        role,
        location_lat,
        location_lng
      })
      .eq('id', req.params.id)
      .select()

    if (error) throw error
    res.json(data[0])
  } catch (error) {
    console.error('Error updating user:', error)
    res.status(500).json({ error: error.message })
  }
})

// Delete user
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', req.params.id)

    if (error) throw error
    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting user:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
