import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="card">
      <h1>Welcome to Crewmate Creator!</h1>
      <p style={{ margin: '1rem 0', fontSize: '1.2rem', lineHeight: '1.6' }}>
        Build your ultimate team of crewmates! Create custom characters, manage your roster, 
        and assemble the perfect crew for your adventures.
      </p>
      
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
        <Link to="/create" className="btn btn-primary">
          Create New Crewmate
        </Link>
        <Link to="/gallery" className="btn btn-secondary">
          View Your Crew
        </Link>
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h2>Features</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '1.5rem' }}>
          <div>
            <h3>🎨 Create</h3>
            <p>Design unique crewmates with custom names and attributes</p>
          </div>
          <div>
            <h3>👥 Manage</h3>
            <p>View and organize all your crewmates in one place</p>
          </div>
          <div>
            <h3>✏️ Edit</h3>
            <p>Update your crewmates' details anytime</p>
          </div>
          <div>
            <h3>📱 Share</h3>
            <p>Each crewmate has their own unique page</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home