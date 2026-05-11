import { useState, useEffect } from 'react'
import axios from 'axios'
import { ATTENDEES, getAttendeeNameById } from '../utils/attendees'
import { formatDateRange } from '../utils/dateFormat'
import './ParkingLot.css'

function ParkingLot() {
  const [items, setItems] = useState([])
  const [forums, setForums] = useState([])
  const [newItem, setNewItem] = useState({ topic_name: '', priority: 'medium', assigned_to_id: '', forum_id: '' })

  useEffect(() => {
    fetchItems()
    fetchForums()
  }, [])

  const fetchItems = async () => {
    try {
      const response = await axios.get('/api/parking-lot')
      setItems(response.data)
    } catch (error) {
      console.error('Error fetching parking lot:', error)
    }
  }

  const fetchForums = async () => {
    try {
      const response = await axios.get('/api/forums')
      setForums(response.data)
    } catch (error) {
      console.error('Error fetching forums:', error)
    }
  }

  const handleAddItem = async (e) => {
    e.preventDefault()
    if (!newItem.topic_name) return

    try {
      await axios.post('/api/parking-lot', newItem)
      setNewItem({ topic_name: '', priority: 'medium' })
      fetchItems()
    } catch (error) {
      console.error('Error adding item:', error)
    }
  }

  const handleResolve = async (id) => {
    try {
      await axios.put(`/api/parking-lot/${id}/resolve`)
      fetchItems()
    } catch (error) {
      console.error('Error resolving item:', error)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/parking-lot/${id}`)
      fetchItems()
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  const priorityColors = {
    low: '#3498db',
    medium: '#f39c12',
    high: '#e74c3c'
  }

  return (
    <div className="parking-lot-container">
      <h2>🅿️ Parking Lot</h2>
      <p className="subtitle">Topics to discuss later</p>

      <form onSubmit={handleAddItem} className="parking-form">
        <input
          type="text"
          value={newItem.topic_name}
          onChange={(e) => setNewItem({ ...newItem, topic_name: e.target.value })}
          placeholder="Topic name"
          required
        />
        <select
          value={newItem.priority}
          onChange={(e) => setNewItem({ ...newItem, priority: e.target.value })}
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
        <select
          value={newItem.assigned_to_id || ''}
          onChange={(e) => setNewItem({ ...newItem, assigned_to_id: e.target.value ? parseInt(e.target.value) : null })}
        >
          <option value="">Assign to...</option>
          {ATTENDEES.map(person => (
            <option key={person.id} value={person.id}>{person.flag} {person.name}</option>
          ))}
        </select>
        <select
          value={newItem.forum_id || ''}
          onChange={(e) => setNewItem({ ...newItem, forum_id: e.target.value || null })}
        >
          <option value="">From forum...</option>
          {forums.map(forum => (
            <option key={forum.id} value={forum.id}>
              {new Date(forum.forum_start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - {forum.city}
            </option>
          ))}
        </select>
        <button type="submit">Add Item</button>
      </form>

      <div className="items-list">
        {items.length === 0 ? (
          <p className="empty">No items in parking lot</p>
        ) : (
          items.map(item => (
            <div key={item.id} className="item-card">
              <div className="item-header">
                <h3>{item.topic_name}</h3>
                <span
                  className="priority-badge"
                  style={{ backgroundColor: priorityColors[item.priority] }}
                >
                  {item.priority}
                </span>
              </div>
              {item.assigned_to_id && (
                <p className="assigned">Assigned to: {getAttendeeNameById(item.assigned_to_id)}</p>
              )}
              {item.forum && (
                <p className="forum-ref">📅 From: {formatDateRange(item.forum.forum_start_date, item.forum.forum_end_date)} in {item.forum.city}</p>
              )}
              <p className="added-date">Added: {formatDate(item.added_at)}</p>
              <div className="item-actions">
                <button className="resolve-btn" onClick={() => handleResolve(item.id)}>
                  Mark Resolved
                </button>
                <button className="delete-btn" onClick={() => handleDelete(item.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ParkingLot
