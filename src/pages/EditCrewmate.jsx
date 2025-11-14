import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'

const ATTRIBUTES = {
  color: ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Black'],
  role: ['Captain', 'Engineer', 'Medic', 'Navigator', 'Security', 'Scientist', 'Chef', 'Botanist'],
  personality: ['Brave', 'Curious', 'Calm', 'Energetic', 'Strategic', 'Creative', 'Analytical', 'Charismatic'],
  skill: ['Combat', 'Armery', 'Medicine', 'Piloting', 'Research', 'Cooking', 'Farming', 'Diplomacy']
}

function EditCrewmate() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    color: '',
    role: '',
    personality: '',
    skill: '',
    bio: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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
      setFormData(data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAttributeSelect = (attribute, value) => {
    setFormData(prev => ({
      ...prev,
      [attribute]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const { error } = await supabase
        .from('crewmates')
        .update(formData)
        .eq('id', id)

      if (error) throw error
      navigate(`/crewmate/${id}`)
    } catch (error) {
      setError(error.message)
    } finally {
      setSaving(false)
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

  if (loading) return <div className="loading">Loading crewmate...</div>
  if (error) return <div className="error">Error: {error}</div>

  return (
    <div className="card">
      <h1>Edit Crewmate</h1>
      <p style={{ marginBottom: '2rem' }}>Update your crewmate's details</p>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Crewmate Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Enter crewmate name"
            required
          />
        </div>

        {Object.entries(ATTRIBUTES).map(([attribute, options]) => (
          <div key={attribute} className="form-group">
            <label className="form-label">
              {attribute.charAt(0).toUpperCase() + attribute.slice(1)}
            </label>
            <div className="attribute-grid">
              {options.map(option => (
                <div
                  key={option}
                  className={`attribute-option ${formData[attribute] === option ? 'selected' : ''}`}
                  onClick={() => handleAttributeSelect(attribute, option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="form-group">
          <label className="form-label">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Tell us about this crewmate..."
            rows="4"
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate(`/crewmate/${id}`)}
          >
            Cancel
          </button>
          <button 
            type="button" 
            className="btn btn-danger"
            onClick={handleDelete}
          >
            Delete Crewmate
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditCrewmate