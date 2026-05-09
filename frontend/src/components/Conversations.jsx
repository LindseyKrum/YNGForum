import { useState, useEffect } from 'react'
import axios from 'axios'
import './Conversations.css'

function Conversations() {
  const [months, setMonths] = useState([])
  const [activeMonth, setActiveMonth] = useState(null)
  const [topics, setTopics] = useState([])
  const [newMonth, setNewMonth] = useState('')
  const [newTopic, setNewTopic] = useState({
    topic_name: '',
    outcome: '',
    action_items: ''
  })
  const [editingTopic, setEditingTopic] = useState(null)
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetchMonths()
    fetchUsers()
  }, [])

  const fetchMonths = async () => {
    try {
      const response = await axios.get('/api/conversations/months')
      setMonths(response.data)
      if (response.data.length > 0) {
        setActiveMonth(response.data[0].id)
        fetchTopics(response.data[0].id)
      }
    } catch (error) {
      console.error('Error fetching months:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users')
      setUsers(response.data)
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const fetchTopics = async (monthId) => {
    try {
      const response = await axios.get(`/api/conversations/${monthId}/topics`)
      setTopics(response.data)
    } catch (error) {
      console.error('Error fetching topics:', error)
    }
  }

  const handleCreateMonth = async (e) => {
    e.preventDefault()
    if (!newMonth) return

    try {
      await axios.post('/api/conversations/months', { month: newMonth })
      setNewMonth('')
      fetchMonths()
    } catch (error) {
      console.error('Error creating month:', error)
    }
  }

  const handleAddTopic = async (e) => {
    e.preventDefault()
    if (!activeMonth || !newTopic.topic_name) return

    try {
      await axios.post(`/api/conversations/${activeMonth}/topics`, {
        ...newTopic,
        action_items: newTopic.action_items.split('\n').filter(x => x.trim())
      })
      setNewTopic({ topic_name: '', outcome: '', action_items: '' })
      fetchTopics(activeMonth)
    } catch (error) {
      console.error('Error adding topic:', error)
    }
  }

  return (
    <div className="conversations-container">
      <div className="conversations-header">
        <h2>Monthly Conversations</h2>
        <form onSubmit={handleCreateMonth} className="month-form">
          <input
            type="month"
            value={newMonth}
            onChange={(e) => setNewMonth(e.target.value)}
            placeholder="YYYY-MM"
          />
          <button type="submit">Add Month</button>
        </form>
      </div>

      <div className="month-selector">
        {months.map(month => (
          <button
            key={month.id}
            className={`month-btn ${activeMonth === month.id ? 'active' : ''}`}
            onClick={() => {
              setActiveMonth(month.id)
              fetchTopics(month.id)
            }}
          >
            {month.month}
          </button>
        ))}
      </div>

      {activeMonth && (
        <div className="topics-section">
          <h3>Topics for {months.find(m => m.id === activeMonth)?.month}</h3>

          <form onSubmit={handleAddTopic} className="topic-form">
            <input
              type="text"
              value={newTopic.topic_name}
              onChange={(e) => setNewTopic({ ...newTopic, topic_name: e.target.value })}
              placeholder="Topic name"
              required
            />
            <textarea
              value={newTopic.outcome}
              onChange={(e) => setNewTopic({ ...newTopic, outcome: e.target.value })}
              placeholder="Outcome/Decision"
              rows="2"
            />
            <textarea
              value={newTopic.action_items}
              onChange={(e) => setNewTopic({ ...newTopic, action_items: e.target.value })}
              placeholder="Action items (one per line)"
              rows="3"
            />
            <button type="submit">Add Topic</button>
          </form>

          <div className="topics-list">
            {topics.map(topic => (
              <div key={topic.id} className="topic-card">
                <h4>{topic.topic_name}</h4>
                {topic.outcome && <p><strong>Outcome:</strong> {topic.outcome}</p>}
                {topic.action_items && topic.action_items.length > 0 && (
                  <div>
                    <strong>Action Items:</strong>
                    <ul>
                      {topic.action_items.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {topic.assigned_user && (
                  <p><strong>Assigned to:</strong> {topic.assigned_user.name}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Conversations
