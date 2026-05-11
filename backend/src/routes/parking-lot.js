import express from 'express'
import { supabase } from '../index.js'

const router = express.Router()

// Get all parking lot items
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('parking_lot')
      .select(`
        *,
        forum:forums(id, forum_start_date, forum_end_date, city)
      `)
      .is('resolved_at', null)
      .order('priority', { ascending: true })

    if (error) throw error
    res.json(data)
  } catch (error) {
    console.error('Error fetching parking lot:', error)
    res.status(500).json({ error: error.message })
  }
})

// Create parking lot item
router.post('/', async (req, res) => {
  try {
    const { topic_name, priority, assigned_to_id, forum_id } = req.body

    const { data, error } = await supabase
      .from('parking_lot')
      .insert([{
        topic_name,
        priority: priority || 'medium',
        assigned_to_id,
        forum_id,
        added_at: new Date().toISOString()
      }])
      .select('*, forum:forums(id, forum_start_date, forum_end_date, city)')

    if (error) throw error
    res.json(data[0])
  } catch (error) {
    console.error('Error creating parking lot item:', error)
    res.status(500).json({ error: error.message })
  }
})

// Update parking lot item
router.put('/:id', async (req, res) => {
  try {
    const { topic_name, priority, assigned_to_id, forum_id } = req.body

    const { data, error } = await supabase
      .from('parking_lot')
      .update({
        topic_name,
        priority,
        assigned_to_id,
        forum_id
      })
      .eq('id', req.params.id)
      .select('*, forum:forums(id, forum_start_date, forum_end_date, city)')

    if (error) throw error
    res.json(data[0])
  } catch (error) {
    console.error('Error updating parking lot item:', error)
    res.status(500).json({ error: error.message })
  }
})

// Mark as resolved
router.put('/:id/resolve', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('parking_lot')
      .update({ resolved_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select('*, assigned_user:users(name)')

    if (error) throw error
    res.json(data[0])
  } catch (error) {
    console.error('Error resolving item:', error)
    res.status(500).json({ error: error.message })
  }
})

// Delete parking lot item
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('parking_lot')
      .delete()
      .eq('id', req.params.id)

    if (error) throw error
    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting item:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
