import { useState, useEffect } from 'react'
import axios from 'axios'
import { ATTENDEES } from '../utils/attendees'
import ForumView from './ForumView'
import './Forums.css'

function Forums() {
  const [forums, setForums] = useState([])
  const [selectedForum, setSelectedForum] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [newForum, setNewForum] = useState({
    forum_date: '',
    city: '',
    host_name: '',
    host_location: '',
    deep_dive_topic: '',
    deep_dive_person_id: ''
  })

  useEffect(() => {
    fetchForums()
  }, [])

  const fetchForums = async () => {
    try {
      const response = await axios.get('/api/forums')
      setForums(response.data)
    } catch (error) {
      console.error('Error fetching forums:', error)
    }
  }

  const handleCreateForum = async (e) => {
    e.preventDefault()
    if (!newForum.forum_date || !newForum.city) return

    try {
      await axios.post('/api/forums', {
        ...newForum,
        deep_dive_person_id: parseInt(newForum.deep_dive_person_id) || null
      })
      setNewForum({
        forum_date: '',
        city: '',
        host_name: '',
        host_location: '',
        deep_dive_topic: '',
        deep_dive_person_id: ''
      })
      setShowForm(false)
      fetchForums()
    } catch (error) {
      console.error('Error creating forum:', error)
    }
  }

  const handleDeleteForum = async (id) => {
    if (confirm('Delete this forum?')) {
      try {
        await axios.delete(`/api/forums/${id}`)
        fetchForums()
        if (selectedForum?.id === id) setSelectedForum(null)
      } catch (error) {
        console.error('Error deleting forum:', error)
      }
    }
  }

  if (selectedForum) {
    return (
      <ForumView
        forum={selectedForum}
        onBack={() => setSelectedForum(null)}
        onDelete={() => {
          handleDeleteForum(selectedForum.id)
          setSelectedForum(null)
        }}
      />
    )
  }

  return (
    <div className="forums-section">
      <div className="forums-header">
        <h3>📅 Forums</h3>
        <button
          className="create-btn"
          onClick={() => setShowForm(!showForm)}
          aria-label={showForm ? 'Cancel' : 'Create new forum'}
        >
          {showForm ? 'Cancel' : '+ New Forum'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateForum} className="forum-form">
          <fieldset>
            <legend>Create New Forum</legend>
            <label htmlFor="forum-date">Forum Date</label>
            <input
              id="forum-date"
              type="date"
              value={newForum.forum_date}
              onChange={(e) => setNewForum({ ...newForum, forum_date: e.target.value })}
              required
              aria-required="true"
            />

            <label htmlFor="city">City</label>
            <input
              id="city"
              type="text"
              value={newForum.city}
              onChange={(e) => setNewForum({ ...newForum, city: e.target.value })}
              placeholder="e.g., New York"
              required
              aria-required="true"
            />

            <label htmlFor="host-name">Host Name</label>
            <input
              id="host-name"
              type="text"
              value={newForum.host_name}
              onChange={(e) => setNewForum({ ...newForum, host_name: e.target.value })}
              placeholder="Who is hosting?"
            />

            <label htmlFor="host-location">Host Location</label>
            <input
              id="host-location"
              type="text"
              value={newForum.host_location}
              onChange={(e) => setNewForum({ ...newForum, host_location: e.target.value })}
              placeholder="e.g., Conference Room A"
            />

            <label htmlFor="deep-dive-topic">Deep Dive Topic</label>
            <input
              id="deep-dive-topic"
              type="text"
              value={newForum.deep_dive_topic}
              onChange={(e) => setNewForum({ ...newForum, deep_dive_topic: e.target.value })}
              placeholder="What's the focus?"
            />

            <label htmlFor="deep-dive-person">Deep Dive Led By</label>
            <select
              id="deep-dive-person"
              value={newForum.deep_dive_person_id}
              onChange={(e) => setNewForum({ ...newForum, deep_dive_person_id: e.target.value })}
            >
              <option value="">Select person</option>
              {ATTENDEES.map(person => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>

            <button type="submit" className="submit-btn">Create Forum</button>
          </fieldset>
        </form>
      )}

      <div className="forums-list">
        {forums.length === 0 ? (
          <p className="empty">No forums yet. Create one to get started!</p>
        ) : (
          forums.map(forum => (
            <div
              key={forum.id}
              className="forum-card"
              onClick={() => setSelectedForum(forum)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => e.key === 'Enter' && setSelectedForum(forum)}
              aria-label={`Forum on ${forum.forum_date} in ${forum.city}`}
            >
              <div className="forum-card-header">
                <h4>{new Date(forum.forum_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</h4>
                <span className="city-badge">{forum.city}</span>
              </div>
              {forum.host_name && <p className="host">Hosted by: {forum.host_name}</p>}
              {forum.deep_dive_topic && <p className="deep-dive">🎯 {forum.deep_dive_topic}</p>}
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteForum(forum.id)
                }}
                aria-label={`Delete forum on ${forum.forum_date}`}
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

export default Forums
