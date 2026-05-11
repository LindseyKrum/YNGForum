import { useState, useEffect } from 'react'
import axios from 'axios'
import { ATTENDEES } from '../utils/attendees'
import { getKeywordFrequency } from '../utils/keywordFlagging'
import { formatDate } from '../utils/dateFormat'
import './CompareNotes.css'

function CompareNotes() {
  const [selectedPerson, setSelectedPerson] = useState(1)
  const [notes, setNotes] = useState([])
  const [keywords, setKeywords] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selectedPerson) {
      fetchPersonNotes()
    }
  }, [selectedPerson])

  const fetchPersonNotes = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/forum-notes/person/${selectedPerson}`)
      setNotes(response.data)

      // Calculate keywords for this person
      const keywordFreq = getKeywordFrequency(response.data)
      setKeywords(keywordFreq)
    } catch (error) {
      console.error('Error fetching notes:', error)
      setNotes([])
      setKeywords([])
    } finally {
      setLoading(false)
    }
  }

  const selectedPersonName = ATTENDEES.find(p => p.id === selectedPerson)?.name || 'Unknown'

  return (
    <div className="compare-notes-section">
      <h3>🔍 Compare Notes</h3>
      <p className="subtitle">See how themes evolve across forums for each person</p>

      <div className="selector-box">
        <label htmlFor="person-select">View notes from:</label>
        <select
          id="person-select"
          value={selectedPerson}
          onChange={(e) => setSelectedPerson(parseInt(e.target.value))}
          aria-label="Select person to view notes"
        >
          {ATTENDEES.map(person => (
            <option key={person.id} value={person.id}>
              {person.flag} {person.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="loading">Loading notes...</p>
      ) : notes.length === 0 ? (
        <p className="empty">No notes yet for {selectedPersonName}</p>
      ) : (
        <div className="timeline">
          {keywords.length > 0 && (
            <div className="keywords-overview">
              <h4>Recurring themes for {selectedPersonName}:</h4>
              <div className="keywords-cloud">
                {keywords.slice(0, 8).map(([keyword, count]) => (
                  <span key={keyword} className="keyword-item" title={`Appears ${count} times`}>
                    {keyword} <small>({count}x)</small>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="forums-timeline">
            {notes.map((noteRecord, idx) => (
              <div key={idx} className="forum-entry">
                <div className="entry-header">
                  <h5>
                    📅 {formatDate(noteRecord.forum.forum_date)}
                  </h5>
                  <span className="location">{noteRecord.forum.city}</span>
                </div>

                <div className="notes-display">
                  <div className="note-field">
                    <label>Note 1:</label>
                    <p className="note-text">{noteRecord.note_field_1 || '(empty)'}</p>
                  </div>
                  <div className="note-field">
                    <label>Note 2:</label>
                    <p className="note-text">{noteRecord.note_field_2 || '(empty)'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default CompareNotes
