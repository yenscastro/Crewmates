import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

function CrewmateDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [crewmate, setCrewmate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCrewmate()
  }, [id])

  const fetchCrewmate = async () => {
    try {
      const { data, error } = await supabase
        .from('crewmates')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setCrewmate(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this crewmate?')) return

    try {
      const { error } = await supabase
        .from('crewmates')
        .delete()
        .eq('id', id)

      if (error) throw error
      navigate('/gallery')
    } catch (error) {
      setError(error.message)
    }
  }

  if (loading) return <div className="loading">Loading crewmate details...</div>
  if (error) return <div className="error">Error: {error}</div>
  if (!crewmate) return <div className="error">Crewmate not found</div>

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1>{crewmate.name}</h1>
          <p style={{ color: 'rgb(102, 102, 102)' }}>Member since {new Date(crewmate.created_at).toLocaleDateString()}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to={`/edit/${crewmate.id}`} className="btn btn-secondary">
            Edit Crewmate
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            Delete Crewmate
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '3rem', alignItems: 'start' }}>
        <div 
          className="crewmate-avatar"
          style={{ 
            width: '120px', 
            height: '120px', 
            fontSize: '3rem',
            backgroundColor: crewmate.color ? crewmate.color.toLowerCase() : 'rgb(102, 126, 234)'
          }}
        >
          {crewmate.name?.charAt(0) || 'C'}
        </div>

        <div>
          <div style={{ marginBottom: '2rem' }}>
            <h2>Attributes</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <strong>Role:</strong>
                <div className="attribute-badge" style={{ display: 'block', marginTop: '0.5rem' }}>
                  {crewmate.role}
                </div>
              </div>
              <div>
                <strong>Color:</strong>
                <div className="attribute-badge" style={{ display: 'block', marginTop: '0.5rem' }}>
                  {crewmate.color}
                </div>
              </div>
              <div>
                <strong>Personality:</strong>
                <div className="attribute-badge" style={{ display: 'block', marginTop: '0.5rem' }}>
                  {crewmate.personality}
                </div>
              </div>
              <div>
                <strong>Primary Skill:</strong>
                <div className="attribute-badge" style={{ display: 'block', marginTop: '0.5rem' }}>
                  {crewmate.skill}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2>Bio</h2>
            <p style={{ marginTop: '1rem', lineHeight: '1.6', fontSize: '1.1rem' }}>
              {crewmate.bio || 'No bio provided for this crewmate.'}
            </p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        <Link to="/gallery" className="btn btn-secondary">
          ← Back to Gallery
        </Link>
        <Link to="/create" className="btn btn-primary">
          Create Another Crewmate
        </Link>
      </div>
    </div>
  )
}

export default CrewmateDetails