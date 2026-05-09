import { useState, useEffect } from 'react'
import axios from 'axios'
import './Newsfeed.css'

function Newsfeed() {
  const [posts, setPosts] = useState([])
  const [users, setUsers] = useState([])
  const [newPost, setNewPost] = useState({
    content_text: '',
    submitter_id: '',
    images: []
  })
  const [preview, setPreview] = useState([])

  useEffect(() => {
    fetchPosts()
    fetchUsers()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/newsfeed')
      setPosts(response.data)
    } catch (error) {
      console.error('Error fetching posts:', error)
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

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files)
    const readers = files.map(file => {
      return new Promise(resolve => {
        const reader = new FileReader()
        reader.onload = (event) => {
          resolve(event.target.result)
        }
        reader.readAsDataURL(file)
      })
    })

    Promise.all(readers).then(results => {
      setPreview(results)
      setNewPost({ ...newPost, images: results })
    })
  }

  const handleSubmitPost = async (e) => {
    e.preventDefault()
    if (!newPost.submitter_id || (!newPost.content_text && newPost.images.length === 0)) return

    try {
      await axios.post('/api/newsfeed', {
        submitter_id: newPost.submitter_id,
        content_text: newPost.content_text,
        image_urls: newPost.images
      })
      setNewPost({ content_text: '', submitter_id: '', images: [] })
      setPreview([])
      fetchPosts()
    } catch (error) {
      console.error('Error posting:', error)
    }
  }

  const handleDeletePost = async (id) => {
    if (confirm('Delete this post?')) {
      try {
        await axios.delete(`/api/newsfeed/${id}`)
        fetchPosts()
      } catch (error) {
        console.error('Error deleting post:', error)
      }
    }
  }

  return (
    <div className="newsfeed-container">
      <h2>Newsfeed</h2>

      <form onSubmit={handleSubmitPost} className="post-form">
        <select
          value={newPost.submitter_id}
          onChange={(e) => setNewPost({ ...newPost, submitter_id: e.target.value })}
          required
        >
          <option value="">Your name</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.name}</option>
          ))}
        </select>
        <textarea
          value={newPost.content_text}
          onChange={(e) => setNewPost({ ...newPost, content_text: e.target.value })}
          placeholder="Share an update..."
          rows="3"
        />
        <label className="file-input-label">
          📷 Add photos
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageSelect}
            style={{ display: 'none' }}
          />
        </label>
        {preview.length > 0 && (
          <div className="preview-images">
            {preview.map((img, idx) => (
              <img key={idx} src={img} alt={`preview-${idx}`} />
            ))}
          </div>
        )}
        <button type="submit">Post Update</button>
      </form>

      <div className="posts-feed">
        {posts.length === 0 ? (
          <p className="empty">No updates yet</p>
        ) : (
          posts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <div>
                  <strong>{post.submitter?.name}</strong>
                  <span className="timestamp">
                    {new Date(post.created_at).toLocaleString()}
                  </span>
                </div>
                <button
                  className="delete-btn"
                  onClick={() => handleDeletePost(post.id)}
                  title="Delete post"
                >
                  ×
                </button>
              </div>
              {post.content_text && (
                <p className="post-content">{post.content_text}</p>
              )}
              {post.image_urls && post.image_urls.length > 0 && (
                <div className="post-images">
                  {post.image_urls.map((url, idx) => (
                    <img key={idx} src={url} alt={`post-${idx}`} />
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Newsfeed
