import { useState } from 'react'
import Forums from '../components/Forums'
import Conversations from '../components/Conversations'
import ParkingLot from '../components/ParkingLot'
import Contacts from '../components/Contacts'
import Newsfeed from '../components/Newsfeed'
import Locations from '../components/Locations'
import CompareNotes from '../components/CompareNotes'
import './Dashboard.css'

function Dashboard({ onLogout }) {
  const [expandedSections, setExpandedSections] = useState({ forums: true })

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>📋 Team Forum Dashboard</h1>
        </div>
        <button className="logout-btn" onClick={onLogout} aria-label="Sign out">
          Sign Out
        </button>
      </header>

      <main className="dashboard-content">
        <ExpandableSection
          title="📅 Forums"
          id="forums"
          isExpanded={expandedSections.forums}
          onToggle={toggleSection}
        >
          <Forums />
        </ExpandableSection>

        <ExpandableSection
          title="💬 Conversations"
          id="conversations"
          isExpanded={expandedSections.conversations}
          onToggle={toggleSection}
        >
          <Conversations />
        </ExpandableSection>

        <ExpandableSection
          title="🅿️ Parking Lot"
          id="parking-lot"
          isExpanded={expandedSections['parking-lot']}
          onToggle={toggleSection}
        >
          <ParkingLot />
        </ExpandableSection>

        <ExpandableSection
          title="👥 Contacts"
          id="contacts"
          isExpanded={expandedSections.contacts}
          onToggle={toggleSection}
        >
          <Contacts />
        </ExpandableSection>

        <ExpandableSection
          title="📸 Newsfeed"
          id="newsfeed"
          isExpanded={expandedSections.newsfeed}
          onToggle={toggleSection}
        >
          <Newsfeed />
        </ExpandableSection>

        <ExpandableSection
          title="🗺️ Locations"
          id="locations"
          isExpanded={expandedSections.locations}
          onToggle={toggleSection}
        >
          <Locations />
        </ExpandableSection>

        <ExpandableSection
          title="🔍 Compare Notes"
          id="compare"
          isExpanded={expandedSections.compare}
          onToggle={toggleSection}
        >
          <CompareNotes />
        </ExpandableSection>
      </main>
    </div>
  )
}

function ExpandableSection({ title, id, isExpanded, onToggle, children }) {
  return (
    <section className="expandable-section" role="region" aria-label={title}>
      <button
        className="section-header"
        onClick={() => onToggle(id)}
        aria-expanded={isExpanded}
        aria-controls={`section-${id}`}
      >
        <span className="section-title">{title}</span>
        <span className="toggle-icon" aria-hidden="true">
          {isExpanded ? '−' : '+'}
        </span>
      </button>
      {isExpanded && (
        <div className="section-content" id={`section-${id}`}>
          {children}
        </div>
      )}
    </section>
  )
}

export default Dashboard
