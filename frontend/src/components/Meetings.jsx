import { useState, useEffect } from 'react'
import axios from 'axios'
import './Meetings.css'

function Meetings() {
  const [meetings, setMeetings] = useState([])
  const [newMeeting, setNewMeeting] = useState({
    meeting_date: '',
    location: '',
    notes: ''
  })

  useEffect(() => {
    fetchMeetings()
  }, [])

  const fetchMeetings = async () => {
    try {
      const response = await axios.get('/api/meetings')
      setMeetings(response.data)
    } catch (error) {
      console.error('Error fetching meetings:', error)
    }
  }

  const handleAddMeeting = async (e) => {
    e.preventDefault()
    if (!newMeeting.meeting_date) return

    try {
      await axios.post('/api/meetings', newMeeting)
      setNewMeeting({ meeting_date: '', location: '', notes: '' })
      fetchMeetings()
    } catch (error) {
      console.error('Error adding meeting:', error)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this meeting?')) {
      try {
        await axios.delete(`/api/meetings/${id}`)
        fetchMeetings()
      } catch (error) {
        console.error('Error deleting meeting:', error)
      }
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const daysUntil = (dateString) => {
    const meetingDate = new Date(dateString + 'T00:00:00')
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const diff = meetingDate - today
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))

    if (days < 0) return 'Past'
    if (days === 0) return 'Today'
    if (days === 1) return 'Tomorrow'
    return `${days} days away`
  }

  return (
    <div className="meetings-container">
      <h2>Upcoming Meetings</h2>
      <p className="subtitle">Schedule and location for next team discussions</p>

      <form onSubmit={handleAddMeeting} className="meeting-form">
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={newMeeting.meeting_date}
            onChange={(e) => setNewMeeting({ ...newMeeting, meeting_date: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            value={newMeeting.location}
            onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
            placeholder="e.g., Conference Room A, Zoom, etc."
          />
        </div>
        <div className="form-group">
          <label>Notes</label>
          <textarea
            value={newMeeting.notes}
            onChange={(e) => setNewMeeting({ ...newMeeting, notes: e.target.value })}
            placeholder="Meeting agenda or notes"
            rows="2"
          />
        </div>
        <button type="submit">Add Meeting</button>
      </form>

      <div className="meetings-list">
        {meetings.length === 0 ? (
          <p className="empty">No meetings scheduled yet</p>
        ) : (
          meetings.map(meeting => (
            <div key={meeting.id} className="meeting-card">
              <div className="meeting-date-box">
                <span className="date-day">
                  {new Date(meeting.meeting_date + 'T00:00:00').getDate()}
                </span>
                <span className="date-month">
                  {new Date(meeting.meeting_date + 'T00:00:00').toLocaleString('en-US', { month: 'short' })}
                </span>
              </div>
              <div className="meeting-details">
                <h3>{formatDate(meeting.meeting_date)}</h3>
                {meeting.location && (
                  <p className="location">📍 {meeting.location}</p>
                )}
                {meeting.notes && (
                  <p className="notes">{meeting.notes}</p>
                )}
                <p className="countdown">{daysUntil(meeting.meeting_date)}</p>
              </div>
              <button
                className="delete-btn"
                onClick={() => handleDelete(meeting.id)}
                title="Delete meeting"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Meetings
