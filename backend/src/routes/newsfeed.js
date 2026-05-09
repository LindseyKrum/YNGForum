import express from 'express'
import { supabase } from '../index.js'

const router = express.Router()

// Get all newsfeed posts
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('newsfeed')
      .select(`
        *,
        submitter:users(id, name)
      `)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error
    res.json(data)
  } catch (error) {
    console.error('Error fetching newsfeed:', error)
    res.status(500).json({ error: error.message })
  }
})

// Create newsfeed post
router.post('/', async (req, res) => {
  try {
    const { submitter_id, content_text, image_urls } = req.body

    const { data, error } = await supabase
      .from('newsfeed')
      .insert([{
        submitter_id,
        content_text,
        image_urls: image_urls || [],
        created_at: new Date().toISOString()
      }])
      .select('*, submitter:users(id, name)')

    if (error) throw error
    res.json(data[0])
  } catch (error) {
    console.error('Error creating post:', error)
    res.status(500).json({ error: error.message })
  }
})

// Delete newsfeed post
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('newsfeed')
      .delete()
      .eq('id', req.params.id)

    if (error) throw error
    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting post:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
