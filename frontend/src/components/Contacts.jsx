import { useState, useEffect } from 'react'
import axios from 'axios'
import './Contacts.css'

function Contacts() {
  const [users, setUsers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    role: ''
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users')
      setUsers(response.data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const handleAddUser = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/users', newUser)
      setNewUser({ name: '', email: '', phone: '', company: '', role: '' })
      setShowForm(false)
      fetchUsers()
    } catch (error) {
      console.error('Error adding user:', error)
    }
  }

  const handleDeleteUser = async (id) => {
    if (confirm('Delete this contact?')) {
      try {
        await axios.delete(`/api/users/${id}`)
        fetchUsers()
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }
  }

  return (
    <div className="contacts-container">
      <div className="contacts-header">
        <h2>Contact Directory</h2>
        <button
          className="add-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add Contact'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddUser} className="contact-form">
          <input
            type="text"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            placeholder="Name"
            required
          />
          <input
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            placeholder="Email"
          />
          <input
            type="tel"
            value={newUser.phone}
            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
            placeholder="Phone"
          />
          <input
            type="text"
            value={newUser.company}
            onChange={(e) => setNewUser({ ...newUser, company: e.target.value })}
            placeholder="Company"
          />
          <input
            type="text"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            placeholder="Role"
          />
          <button type="submit">Save Contact</button>
        </form>
      )}

      <div className="contacts-grid">
        {users.length === 0 ? (
          <p className="empty">No contacts yet</p>
        ) : (
          users.map(user => (
            <div key={user.id} className="contact-card">
              <div className="contact-header">
                <div>
                  <h3>{user.name}</h3>
                  {user.role && <p className="role">{user.role}</p>}
                </div>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteUser(user.id)}
                  title="Delete contact"
                >
                  ×
                </button>
              </div>
              {user.company && <p><strong>Company:</strong> {user.company}</p>}
              {user.email && <p><a href={`mailto:${user.email}`}>{user.email}</a></p>}
              {user.phone && <p><a href={`tel:${user.phone}`}>{user.phone}</a></p>}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Contacts
