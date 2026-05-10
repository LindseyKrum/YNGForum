import express from 'express'
import { supabase } from '../index.js'

const router = express.Router()

// Get all notes for a specific person across all forums
router.get('/person/:personId', async (req, res) => {
  try {
    const { personId } = req.params

    // Get all notes for this person
    const { data: notes, error: notesError } = await supabase
      .from('forum_notes')
      .select('*')
      .eq('person_id', personId)
      .order('created_at', { ascending: true })

    if (notesError) throw notesError

    // Get forum details for each note
    const forumIds = [...new Set(notes.map(n => n.forum_id))]
    const { data: forums, error: forumsError } = await supabase
      .from('forums')
      .select('*')
      .in('id', forumIds)

    if (forumsError) throw forumsError

    // Combine notes with forum info
    const combined = notes.map(note => {
      const forum = forums.find(f => f.id === note.forum_id)
      return { ...note, forum }
    })

    res.json(combined)
  } catch (error) {
    console.error('Error fetching notes:', error)
    res.status(500).json({ error: error.message })
  }
})

// Get notes for a specific person in a specific forum
router.get('/:forumId/:personId', async (req, res) => {
  try {
    const { forumId, personId } = req.params

    const { data, error } = await supabase
      .from('forum_notes')
      .select('*')
      .eq('forum_id', forumId)
      .eq('person_id', personId)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows

    res.json(data || { forum_id: forumId, person_id: personId, note_field_1: '', note_field_2: '' })
  } catch (error) {
    console.error('Error fetching note:', error)
    res.status(500).json({ error: error.message })
  }
})

// Save notes for a person in a forum
router.post('/:forumId/:personId', async (req, res) => {
  try {
    const { forumId, personId } = req.params
    const { note_field_1, note_field_2 } = req.body

    // Check if note already exists
    const { data: existing } = await supabase
      .from('forum_notes')
      .select('id')
      .eq('forum_id', forumId)
      .eq('person_id', personId)
      .single()

    if (existing) {
      // Update existing note
      const { data, error } = await supabase
        .from('forum_notes')
        .update({
          note_field_1,
          note_field_2,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()

      if (error) throw error
      return res.json(data[0])
    } else {
      // Create new note
      const { data, error } = await supabase
        .from('forum_notes')
        .insert([{
          forum_id: forumId,
          person_id: parseInt(personId),
          note_field_1,
          note_field_2,
          created_at: new Date().toISOString()
        }])
        .select()

      if (error) throw error
      return res.json(data[0])
    }
  } catch (error) {
    console.error('Error saving note:', error)
    res.status(500).json({ error: error.message })
  }
})

// Delete note
router.delete('/:forumId/:personId', async (req, res) => {
  try {
    const { forumId, personId } = req.params

    const { error } = await supabase
      .from('forum_notes')
      .delete()
      .eq('forum_id', forumId)
      .eq('person_id', personId)

    if (error) throw error
    res.json({ success: true })
  } catch (error) {
    console.error('Error deleting note:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
