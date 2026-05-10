import { useState } from 'react'
import './Locations.css'

function Locations() {
  const [mapImage, setMapImage] = useState(localStorage.getItem('locationMapImage') || null)
  const [isUploading, setIsUploading] = useState(false)

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setIsUploading(true)
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageData = event.target.result
        setMapImage(imageData)
        localStorage.setItem('locationMapImage', imageData)
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleClearMap = () => {
    setMapImage(null)
    localStorage.removeItem('locationMapImage')
  }

  return (
    <div className="locations-container">
      <h2>🗺️ Locations</h2>
      <p className="subtitle">Team locations map</p>

      <div className="map-section">
        {mapImage ? (
          <div className="map-display">
            <img src={mapImage} alt="Team locations map" />
            <button className="update-btn" onClick={() => document.getElementById('mapUpload').click()}>
              Update Map
            </button>
            <button className="clear-btn" onClick={handleClearMap}>
              Clear Map
            </button>
          </div>
        ) : (
          <div className="map-placeholder">
            <p>📍 No map uploaded yet</p>
            <p className="hint">Upload an image showing where team members are based</p>
            <button onClick={() => document.getElementById('mapUpload').click()}>
              Upload Map
            </button>
          </div>
        )}
        <input
          id="mapUpload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
          disabled={isUploading}
        />
      </div>

      <div className="info-box">
        <h3>How to use:</h3>
        <ul>
          <li>Upload an image or screenshot of a map showing team member locations</li>
          <li>Mark each location with annotations or labels in your image editor first</li>
          <li>Update the map anytime the team's locations change</li>
        </ul>
      </div>
    </div>
  )
}

export default Locations
