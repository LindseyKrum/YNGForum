import { useState, useEffect } from 'react'
import axios from 'axios'
import { ATTENDEES, getAttendeeNameById } from '../utils/attendees'
import { getKeywordFrequency } from '../utils/keywordFlagging'
import './ForumView.css'

function ForumView({ forum, onBack, onDelete }) {
  const [notes, setNotes] = useState({})
  const [loading, setLoading] = useState(false)
  const [keywords, setKeywords] = useState({})

  useEffect(() => {
    fetchNotes()
  }, [forum.id])

  const fetchNotes = async () => {
    try {
      const response = await axios.get(`/api/forums/${forum.id}`)
      const notesMap = {}
      response.data.notes?.forEach(note => {
        notesMap[note.person_id] = note
      })
      setNotes(notesMap)

      // Get keywords for each person
      const keywordMap = {}
      ATTENDEES.forEach(person => {
        const personNotes = response.data.notes?.filter(n => n.person_id === person.id) || []
        if (personNotes.length > 0) {
          keywordMap[person.id] = getKeywordFrequency(personNotes)
        }
      })
      setKeywords(keywordMap)
    } catch (error) {
      console.error('Error fetching notes:', error)
    }
  }

  const handleSaveNotes = async (personId, noteField1, noteField2) => {
    try {
      setLoading(true)
      await axios.post(`/api/forum-notes/${forum.id}/${personId}`, {
        note_field_1: noteField1,
        note_field_2: noteField2
      })
      await fetchNotes()
    } catch (error) {
      console.error('Error saving notes:', error)
    } finally {
      setLoading(false)
    }
  }

  const deepDives = [
    {
      topic: forum.deep_dive_topic,
      personId: forum.deep_dive_person_id
    },
    {
      topic: forum.deep_dive_2_topic,
      personId: forum.deep_dive_2_person_id
    },
    {
      topic: forum.deep_dive_3_topic,
      personId: forum.deep_dive_3_person_id
    }
  ].filter(dd => dd.topic)

  return (
    <div className="forum-view">
      <button className="back-btn" onClick={onBack} aria-label="Back to forums">
        ← Back
      </button>

      <div className="forum-header">
        <div>
          <h2>📅 Forum — {new Date(forum.forum_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</h2>
          <p className="forum-meta">{forum.city} • Hosted by {forum.host_name || 'TBD'} • {forum.host_location || ''}</p>
        </div>
        <button className="delete-btn" onClick={onDelete} aria-label="Delete forum">Delete</button>
      </div>

      {deepDives.length > 0 && (
        <div className="deep-dives-container" role="region" aria-label="Deep dive topics">
          <h3>🎯 Deep Dives</h3>
          <div className="deep-dives-grid">
            {deepDives.map((dd, idx) => (
              <div key={idx} className="deep-dive-section">
                <p className="topic">{dd.topic}</p>
                <p className="person">Led by: <strong>{getAttendeeNameById(dd.personId) || 'TBD'}</strong></p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="attendees-section" role="region" aria-label="Forum attendees and notes">
        <h3>Attendee Notes</h3>
        <div className="attendees-grid">
          {ATTENDEES.map(person => {
            const personNotes = notes[person.id] || { note_field_1: '', note_field_2: '' }
            const personKeywords = keywords[person.id] || []
            return (
              <AttendeeCard
                key={person.id}
                person={person}
                notes={personNotes}
                keywords={personKeywords}
                onSave={handleSaveNotes}
                loading={loading}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

function AttendeeCard({ person, notes, keywords, onSave, loading }) {
  const [field1, setField1] = useState(notes.note_field_1)
  const [field2, setField2] = useState(notes.note_field_2)
  const [saved, setSaved] = useState(true)

  const handleChange = (field, value) => {
    setSaved(false)
    if (field === 1) setField1(value)
    else setField2(value)
  }

  const handleSave = async () => {
    await onSave(person.id, field1, field2)
    setSaved(true)
  }

  return (
    <article className="attendee-card">
      <div className="attendee-header">
        <h4>
          <span className="flag">{person.flag}</span>
          {person.name}
        </h4>
      </div>

      {keywords.length > 0 && (
        <div className="keywords-section" role="note" aria-label="Recurring keywords">
          <p className="keywords-label">🔍 Recurring keywords:</p>
          <div className="keywords-list">
            {keywords.slice(0, 3).map(([keyword, count]) => (
              <span key={keyword} className="keyword-badge">
                {keyword} <small>({count}x)</small>
              </span>
            ))}
          </div>
        </div>
      )}

      <fieldset>
        <legend className="sr-only">Notes for {person.name}</legend>

        <label htmlFor={`field1-${person.id}`} className="field-label">
          Note 1
        </label>
        <textarea
          id={`field1-${person.id}`}
          value={field1}
          onChange={(e) => handleChange(1, e.target.value)}
          placeholder="Observation 1..."
          rows="3"
          aria-label={`Note 1 for ${person.name}`}
        />

        <label htmlFor={`field2-${person.id}`} className="field-label">
          Note 2
        </label>
        <textarea
          id={`field2-${person.id}`}
          value={field2}
          onChange={(e) => handleChange(2, e.target.value)}
          placeholder="Observation 2..."
          rows="3"
          aria-label={`Note 2 for ${person.name}`}
        />

        <button
          className={`save-btn ${saved ? 'saved' : 'unsaved'}`}
          onClick={handleSave}
          disabled={loading || saved}
          aria-busy={loading}
        >
          {saved ? '✓ Saved' : 'Save Notes'}
        </button>
      </fieldset>
    </article>
  )
}

export default ForumView
