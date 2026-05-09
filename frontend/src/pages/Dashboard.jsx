import { useState } from 'react'
import Conversations from '../components/Conversations'
import ParkingLot from '../components/ParkingLot'
import Contacts from '../components/Contacts'
import Newsfeed from '../components/Newsfeed'
import Locations from '../components/Locations'
import Meetings from '../components/Meetings'
import './Dashboard.css'

function Dashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('conversations')

  const renderContent = () => {
    switch (activeTab) {
      case 'conversations':
        return <Conversations />
      case 'parking-lot':
        return <ParkingLot />
      case 'contacts':
        return <Contacts />
      case 'newsfeed':
        return <Newsfeed />
      case 'locations':
        return <Locations />
      case 'meetings':
        return <Meetings />
      default:
        return <Conversations />
    }
  }

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h1>Team Dashboard</h1>
        <div className="nav-items">
          <button
            className={`nav-btn ${activeTab === 'conversations' ? 'active' : ''}`}
            onClick={() => setActiveTab('conversations')}
          >
            Conversations
          </button>
          <button
            className={`nav-btn ${activeTab === 'parking-lot' ? 'active' : ''}`}
            onClick={() => setActiveTab('parking-lot')}
          >
            Parking Lot
          </button>
          <button
            className={`nav-btn ${activeTab === 'contacts' ? 'active' : ''}`}
            onClick={() => setActiveTab('contacts')}
          >
            Contacts
          </button>
          <button
            className={`nav-btn ${activeTab === 'newsfeed' ? 'active' : ''}`}
            onClick={() => setActiveTab('newsfeed')}
          >
            Newsfeed
          </button>
          <button
            className={`nav-btn ${activeTab === 'locations' ? 'active' : ''}`}
            onClick={() => setActiveTab('locations')}
          >
            Locations
          </button>
          <button
            className={`nav-btn ${activeTab === 'meetings' ? 'active' : ''}`}
            onClick={() => setActiveTab('meetings')}
          >
            Meetings
          </button>
          <button className="nav-btn logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </nav>
      <div className="content">
        {renderContent()}
      </div>
    </div>
  )
}

export default Dashboard
