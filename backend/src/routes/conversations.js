import express from 'express'
import { supabase } from '../index.js'

const router = express.Router()

// Get all conversation months
router.get('/months', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('conversation_months')
      .select('*')
      .order('month', { ascending: false })

    if (error) throw error
    res.json(data)
  } catch (error) {
    console.error('Error fetching months:', error)
    res.status(500).json({ error: error.message })
  }
})

// Create conversation month
router.post('/months', async (req, res) => {
  try {
    const { month } = req.body

    const { data, error } = await supabase
      .from('conversation_months')
      .insert([{ month, created_at: new Date().toISOString() }])
      .select()

    if (error) throw error
    res.json(data[0])
  } catch (error) {
    console.error('Error creating month:', error)
    res.status(500).json({ error: error.message })
  }
})

// Get topics for a month
router.get('/:monthId/topics', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('conversation_topics')
      .select(`
        *,
        assigned_user:users(name)
      `)
      .eq('month_id', req.params.monthId)
      .order('created_at', { ascending: false })

    if (error) throw error
    res.json(data)
  } catch (error) {
    console.error('Error fetching topics:', error)
    res.status(500).json({ error: error.message })
  }
})

// Create topic
router.post('/:monthId/topics', async (req, res) => {
  try {
    const { topic_name, outcome, action_items, assigned_to_id } = req.body

    const { data, error } = await supabase
      .from('conversation_topics')
      .insert([{
        month_id: req.params.monthId,
        topic_name,
        outcome,
        action_items,
        assigned_to_id,
        created_at: new Date().toISOString()
      }])
      .select('*, assigned_user:users(name)')

    if (error) throw error
    res.json(data[0])
  } catch (error) {
    console.error('Error creating topic:', error)
    res.status(500).json({ error: error.message })
  }
})

// Update topic
router.put('/:monthId/topics/:topicId', async (req, res) => {
  try {
    const { topic_name, outcome, action_items, assigned_to_id } = req.body

    const { data, error } = await supabase
      .from('conversation_topics')
      .update({
        topic_name,
        outcome,
        action_items,
        assigned_to_id,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.topicId)
      .select('*, assigned_user:users(name)')

    if (error) throw error
    res.json(data[0])
  } catch (error) {
    console.error('Error updating topic:', error)
    res.status(500).json({ error: error.message })
  }
})

// Delete topic
router.delete('/:monthId/topics/:topicId', async (req, res) => {
  try {
    const { error } = await supabase
      .from('conversation_topics')
      .delete()
      .eq('id', req.params.topicId)

    if (error) throw error
    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting topic:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
