import { useState } from 'react'
import Forums from '../components/Forums'
import ParkingLot from '../components/ParkingLot'
import Contacts from '../components/Contacts'
import Newsfeed from '../components/Newsfeed'
import Locations from '../components/Locations'
import CompareNotes from '../components/CompareNotes'
import './Dashboard.css'

function Dashboard({ onLogout }) {
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
        <section className="hero-section">
          <Forums />
        </section>

        <div className="card-grid">
          <section className="card-section">
            <CompareNotes />
          </section>

          <section className="card-section">
            <ParkingLot />
          </section>

          <section className="card-section">
            <Contacts />
          </section>

          <section className="card-section">
            <Newsfeed />
          </section>

          <section className="card-section">
            <Locations />
          </section>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
