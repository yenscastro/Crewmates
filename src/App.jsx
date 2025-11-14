import React from 'react'
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate, Link, useLocation } from 'react-router-dom'
import { supabase } from './supabaseClient.js'

function Navigation() {
  const location = useLocation()
  
  return (
    <nav className="nav">
      <ul className="nav-list">
        <li>
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            🏠 Home
          </Link>
        </li>
        <li>
          <Link 
            to="/create" 
            className={`nav-link ${location.pathname === '/create' ? 'active' : ''}`}
          >
            ✨ Create Crewmate
          </Link>
        </li>
        <li>
          <Link 
            to="/gallery" 
            className={`nav-link ${location.pathname === '/gallery' ? 'active' : ''}`}
          >
            👥 Crewmate Gallery
          </Link>
        </li>
      </ul>
    </nav>
  )
}

function Home() {
  return (
    <div className="card">
      <h1>🚀 Welcome to Crewmate Creator!</h1>
      <p style={{ margin: '1rem 0', fontSize: '1.2rem', lineHeight: '1.6' }}>
        Build your ultimate team of crewmates! Create custom characters, manage your roster, 
        and assemble the perfect crew for your adventures.
      </p>
      
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
        <Link to="/create" className="btn btn-primary">✨ Create New Crewmate</Link>
        <Link to="/gallery" className="btn btn-secondary">👥 View Your Crew</Link>
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h2>🌟 Features</h2>
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

function CreateCrewmate() {
  const [formData, setFormData] = React.useState({
    name: '',
    color: '',
    role: '',
    personality: '',
    skill: '',
    bio: ''
  })
  const [loading, setLoading] = React.useState(false)
  const [message, setMessage] = React.useState('')

  const ATTRIBUTES = {
    color: ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Black'],
    role: ['👑 Captain', '🔧 Engineer', '⚕️ Medic', '🧭 Navigator', '🛡️ Security', '🔬 Scientist', '👨‍🍳 Chef', '🌿 Botanist'],
    personality: ['Brave', 'Curious', 'Calm', 'Energetic', 'Strategic', 'Creative', 'Analytical', 'Charismatic'],
    skill: ['Combat', 'Armery', 'Medicine', 'Piloting', 'Research', 'Cooking', 'Farming', 'Diplomacy']
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
    setLoading(true)
    setMessage('')
    
    try {
      const { data, error } = await supabase
        .from('crewmates')
        .insert([
          { 
            name: formData.name,
            color: formData.color,
            role: formData.role,
            personality: formData.personality,
            skill: formData.skill,
            bio: formData.bio
          }
        ])

      if (error) throw error

      setMessage('✅ Crewmate created successfully! Redirecting to gallery...')
      
      setFormData({
        name: '',
        color: '',
        role: '',
        personality: '',
        skill: '',
        bio: ''
      })

      setTimeout(() => {
        window.location.href = '/gallery'
      }, 2000)

    } catch (error) {
      setMessage(`❌ Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h1>✨ Create New Crewmate</h1>
      <p style={{ marginBottom: '2rem' }}>Design your perfect crewmate by choosing their attributes</p>

      {message && (
        <div className={message.includes('❌') ? 'error' : 'success'}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">👤 Crewmate Name *</label>
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

        <div className="form-group">
          <label className="form-label">🎨 Color *</label>
          <div className="attribute-grid">
            {ATTRIBUTES.color.map(color => (
              <div
                key={color}
                className={`attribute-option ${formData.color === color ? 'selected' : ''}`}
                onClick={() => handleAttributeSelect('color', color)}
                style={{ 
                  border: formData.color === color ? '3px solid #3498db' : '2px solid #34495e',
                  background: formData.color === color ? getColorHex(color) : '#2c3e50',
                  color: formData.color === color ? 'white' : '#ecf0f1',
                  fontWeight: 'bold'
                }}
              >
                {color}
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">💼 Role *</label>
          <div className="attribute-grid">
            {ATTRIBUTES.role.map(role => (
              <div
                key={role}
                className={`attribute-option ${formData.role === role ? 'selected' : ''}`}
                onClick={() => handleAttributeSelect('role', role)}
              >
                {role}
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">😊 Personality</label>
          <div className="attribute-grid">
            {ATTRIBUTES.personality.map(personality => (
              <div
                key={personality}
                className={`attribute-option ${formData.personality === personality ? 'selected' : ''}`}
                onClick={() => handleAttributeSelect('personality', personality)}
              >
                {personality}
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">⚡ Skill</label>
          <div className="attribute-grid">
            {ATTRIBUTES.skill.map(skill => (
              <div
                key={skill}
                className={`attribute-option ${formData.skill === skill ? 'selected' : ''}`}
                onClick={() => handleAttributeSelect('skill', skill)}
              >
                {skill}
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">📖 Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            className="form-input"
            placeholder="Tell us about this crewmate's background, special abilities, or personality traits..."
            rows="4"
          />
        </div>

        {formData.name && (
          <div className="form-group" style={{ 
            background: 'rgba(52, 152, 219, 0.1)', 
            padding: '1.5rem', 
            borderRadius: '10px',
            border: '2px solid rgba(52, 152, 219, 0.3)'
          }}>
            <h3>👀 Crewmate Preview</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
              <div 
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: formData.color ? getColorHex(formData.color) : '#34495e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.5rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                }}
              >
                {formData.name.charAt(0)}
              </div>
              <div>
                <strong>{formData.name}</strong>
                <div style={{ marginTop: '0.5rem' }}>
                  {formData.role && <span className="attribute-badge">{formData.role}</span>}
                  {formData.color && <span className="attribute-badge">{formData.color}</span>}
                  {formData.personality && <span className="attribute-badge">{formData.personality}</span>}
                  {formData.skill && <span className="attribute-badge">{formData.skill}</span>}
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading || !formData.name || !formData.color || !formData.role}
          >
            {loading ? '⏳ Creating...' : '✨ Create Crewmate'}
          </button>
          <Link to="/" className="btn btn-secondary">
            ↩️ Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

function CrewmateGallery() {
  const [crewmates, setCrewmates] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    fetchCrewmates()
  }, [])

  const fetchCrewmates = async () => {
    try {
      const { data, error } = await supabase
        .from('crewmates')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setCrewmates(data || [])
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this crewmate?')) return

    try {
      const { error } = await supabase
        .from('crewmates')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setCrewmates(prev => prev.filter(crewmate => crewmate.id !== id))
    } catch (error) {
      setError(error.message)
    }
  }

  if (loading) return (
    <div className="card">
      <div className="loading">⏳ Loading your crewmates...</div>
    </div>
  )

  if (error) return (
    <div className="card">
      <div className="error">❌ Error: {error}</div>
    </div>
  )

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>👥 Your Crewmate Gallery</h1>
        <Link to="/create" className="btn btn-primary">
          ✨ New Crewmate
        </Link>
      </div>

      <p>You have {crewmates.length} crewmate{crewmates.length !== 1 ? 's' : ''} in your crew</p>
      
      <div className="crewmate-grid">
        {crewmates.map(crewmate => (
          <div key={crewmate.id} className="crewmate-card">
            <div 
              className="crewmate-avatar"
              style={{ 
                backgroundColor: crewmate.color ? getColorHex(crewmate.color) : '#3498db'
              }}
            >
              {crewmate.name?.charAt(0) || 'C'}
            </div>
            <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>{crewmate.name}</h3>
            <div style={{ marginBottom: '1rem' }}>
              <span className="attribute-badge">{crewmate.role}</span>
              <span className="attribute-badge">{crewmate.color}</span>
              {crewmate.personality && <span className="attribute-badge">{crewmate.personality}</span>}
            </div>
            <p style={{ fontSize: '0.9rem', color: '#bdc3c7', marginBottom: '1.5rem' }}>
              {crewmate.bio || 'No bio provided'}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to={`/crewmate/${crewmate.id}`} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                👀 View
              </Link>
              <Link to={`/edit/${crewmate.id}`} className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                ✏️ Edit
              </Link>
              <button 
                onClick={() => handleDelete(crewmate.id)}
                className="btn btn-danger" 
                style={{ padding: '0.5rem 1rem' }}
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {crewmates.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>😔 No crewmates yet!</h3>
          <p style={{ margin: '1rem 0' }}>Create your first crewmate to get started.</p>
          <Link to="/create" className="btn btn-primary">
            ✨ Create Your First Crewmate
          </Link>
        </div>
      )}
    </div>
  )
}

function CrewmateDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [crewmate, setCrewmate] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
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

  if (loading) return (
    <div className="card">
      <div className="loading">⏳ Loading crewmate details...</div>
    </div>
  )

  if (error) return (
    <div className="card">
      <div className="error">❌ Error: {error}</div>
    </div>
  )

  if (!crewmate) return (
    <div className="card">
      <div className="error">❌ Crewmate not found</div>
    </div>
  )

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1>👤 {crewmate.name}</h1>
          <p style={{ color: '#bdc3c7' }}>📅 Member since {new Date(crewmate.created_at).toLocaleDateString()}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to={`/edit/${crewmate.id}`} className="btn btn-secondary">
            ✏️ Edit Crewmate
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            🗑️ Delete Crewmate
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
            backgroundColor: crewmate.color ? getColorHex(crewmate.color) : '#3498db'
          }}
        >
          {crewmate.name?.charAt(0) || 'C'}
        </div>

        <div>
          <div style={{ marginBottom: '2rem' }}>
            <h2>📊 Attributes</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
              <div>
                <strong>💼 Role:</strong>
                <div className="attribute-badge" style={{ display: 'block', marginTop: '0.5rem', fontSize: '1rem' }}>
                  {crewmate.role}
                </div>
              </div>
              <div>
                <strong>🎨 Color:</strong>
                <div className="attribute-badge" style={{ display: 'block', marginTop: '0.5rem', fontSize: '1rem' }}>
                  {crewmate.color}
                </div>
              </div>
              <div>
                <strong>😊 Personality:</strong>
                <div className="attribute-badge" style={{ display: 'block', marginTop: '0.5rem', fontSize: '1rem' }}>
                  {crewmate.personality || 'Not specified'}
                </div>
              </div>
              <div>
                <strong>⚡ Primary Skill:</strong>
                <div className="attribute-badge" style={{ display: 'block', marginTop: '0.5rem', fontSize: '1rem' }}>
                  {crewmate.skill || 'Not specified'}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2>📖 Bio</h2>
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
          ✨ Create Another Crewmate
        </Link>
      </div>
    </div>
  )
}

function EditCrewmate() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = React.useState({
    name: '',
    color: '',
    role: '',
    personality: '',
    skill: '',
    bio: ''
  })
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState('')

  const ATTRIBUTES = {
    color: ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Black'],
    role: ['👑 Captain', '🔧 Engineer', '⚕️ Medic', '🧭 Navigator', '🛡️ Security', '🔬 Scientist', '👨‍🍳 Chef', '🌿 Botanist'],
    personality: ['Brave', 'Curious', 'Calm', 'Energetic', 'Strategic', 'Creative', 'Analytical', 'Charismatic'],
    skill: ['Combat', 'Armery', 'Medicine', 'Piloting', 'Research', 'Cooking', 'Farming', 'Diplomacy']
  }

  React.useEffect(() => {
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

  if (loading) return (
    <div className="card">
      <div className="loading">⏳ Loading crewmate...</div>
    </div>
  )

  if (error) return (
    <div className="card">
      <div className="error">❌ Error: {error}</div>
    </div>
  )

  return (
    <div className="card">
      <h1>✏️ Edit Crewmate</h1>
      <p style={{ marginBottom: '2rem' }}>Update your crewmate's details</p>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">👤 Crewmate Name</label>
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
              {attribute === 'color' ? '🎨' : attribute === 'role' ? '💼' : attribute === 'personality' ? '😊' : '⚡'} 
              {' '}
              {attribute.charAt(0).toUpperCase() + attribute.slice(1)}
            </label>
            <div className="attribute-grid">
              {options.map(option => (
                <div
                  key={option}
                  className={`attribute-option ${formData[attribute] === option ? 'selected' : ''}`}
                  onClick={() => handleAttributeSelect(attribute, option)}
                  style={attribute === 'color' ? { 
                    border: formData[attribute] === option ? '3px solid #3498db' : '2px solid #34495e',
                    background: formData[attribute] === option ? getColorHex(option) : '#2c3e50',
                    color: formData[attribute] === option ? 'white' : '#ecf0f1',
                    fontWeight: 'bold'
                  } : {}}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="form-group">
          <label className="form-label">📖 Bio</label>
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
            {saving ? '⏳ Saving...' : '💾 Save Changes'}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate(`/crewmate/${id}`)}
          >
            ↩️ Cancel
          </button>
          <button 
            type="button" 
            className="btn btn-danger"
            onClick={handleDelete}
          >
            🗑️ Delete Crewmate
          </button>
        </div>
      </form>
    </div>
  )
}

// Helper function for color mapping
function getColorHex(colorName) {
  const colorMap = {
    'Red': '#c0392b',
    'Blue': '#2980b9',
    'Green': '#27ae60',
    'Yellow': '#f39c12',
    'Purple': '#8e44ad',
    'Orange': '#d35400',
    'Pink': '#e84393',
    'Black': '#2c3e50'
  }
  return colorMap[colorName] || '#3498db'
}

function App() {
  return (
    <Router>
      <div className="container">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateCrewmate />} />
          <Route path="/gallery" element={<CrewmateGallery />} />
          <Route path="/crewmate/:id" element={<CrewmateDetails />} />
          <Route path="/edit/:id" element={<EditCrewmate />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App