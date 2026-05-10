import express from 'express'
import { supabase } from '../index.js'

const router = express.Router()

// Get all forums with their notes
router.get('/', async (req, res) => {
  try {
    const { data: forums, error } = await supabase
      .from('forums')
      .select('*')
      .order('forum_date', { ascending: false })

    if (error) throw error
    res.json(forums)
  } catch (error) {
    console.error('Error fetching forums:', error)
    res.status(500).json({ error: error.message })
  }
})

// Get single forum with all attendee notes
router.get('/:id', async (req, res) => {
  try {
    const { data: forum, error: forumError } = await supabase
      .from('forums')
      .select('*')
      .eq('id', req.params.id)
      .single()

    if (forumError) throw forumError

    const { data: notes, error: notesError } = await supabase
      .from('forum_notes')
      .select('*')
      .eq('forum_id', req.params.id)

    if (notesError) throw notesError

    res.json({ ...forum, notes })
  } catch (error) {
    console.error('Error fetching forum:', error)
    res.status(500).json({ error: error.message })
  }
})

// Create forum
router.post('/', async (req, res) => {
  try {
    const {
      forum_date,
      city,
      host_name,
      host_location,
      deep_dive_topic,
      deep_dive_person_id,
      deep_dive_2_topic,
      deep_dive_2_person_id,
      deep_dive_3_topic,
      deep_dive_3_person_id
    } = req.body

    const { data, error } = await supabase
      .from('forums')
      .insert([{
        forum_date,
        city,
        host_name,
        host_location,
        deep_dive_topic,
        deep_dive_person_id,
        deep_dive_2_topic,
        deep_dive_2_person_id,
        deep_dive_3_topic,
        deep_dive_3_person_id,
        created_at: new Date().toISOString()
      }])
      .select()

    if (error) throw error
    res.json(data[0])
  } catch (error) {
    console.error('Error creating forum:', error)
    res.status(500).json({ error: error.message })
  }
})

// Update forum
router.put('/:id', async (req, res) => {
  try {
    const {
      forum_date,
      city,
      host_name,
      host_location,
      deep_dive_topic,
      deep_dive_person_id,
      deep_dive_2_topic,
      deep_dive_2_person_id,
      deep_dive_3_topic,
      deep_dive_3_person_id
    } = req.body

    const { data, error } = await supabase
      .from('forums')
      .update({
        forum_date,
        city,
        host_name,
        host_location,
        deep_dive_topic,
        deep_dive_person_id,
        deep_dive_2_topic,
        deep_dive_2_person_id,
        deep_dive_3_topic,
        deep_dive_3_person_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select()

    if (error) throw error
    res.json(data[0])
  } catch (error) {
    console.error('Error updating forum:', error)
    res.status(500).json({ error: error.message })
  }
})

// Delete forum
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('forums')
      .delete()
      .eq('id', req.params.id)

    if (error) throw error
    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting forum:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
