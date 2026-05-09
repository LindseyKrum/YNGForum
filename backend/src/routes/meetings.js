import express from 'express'
import { supabase } from '../index.js'

const router = express.Router()

// Get upcoming meetings
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .eq('is_upcoming', true)
      .order('meeting_date', { ascending: true })

    if (error) throw error
    res.json(data)
  } catch (error) {
    console.error('Error fetching meetings:', error)
    res.status(500).json({ error: error.message })
  }
})

// Create meeting
router.post('/', async (req, res) => {
  try {
    const { meeting_date, location, notes } = req.body

    const { data, error } = await supabase
      .from('meetings')
      .insert([{
        meeting_date,
        location,
        notes,
        is_upcoming: true,
        created_at: new Date().toISOString()
      }])
      .select()

    if (error) throw error
    res.json(data[0])
  } catch (error) {
    console.error('Error creating meeting:', error)
    res.status(500).json({ error: error.message })
  }
})

// Update meeting
router.put('/:id', async (req, res) => {
  try {
    const { meeting_date, location, notes, is_upcoming } = req.body

    const { data, error } = await supabase
      .from('meetings')
      .update({
        meeting_date,
        location,
        notes,
        is_upcoming,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select()

    if (error) throw error
    res.json(data[0])
  } catch (error) {
    console.error('Error updating meeting:', error)
    res.status(500).json({ error: error.message })
  }
})

// Delete meeting
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('meetings')
      .delete()
      .eq('id', req.params.id)

    if (error) throw error
    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting meeting:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
