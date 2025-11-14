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
    role: ['Captain', 'Engineer', 'Medic', 'Navigator', 'Security', 'Scientist', 'Chef', 'Botanist'],
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
      const { supabase } = await import('../supabaseClient.js')
      
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
        .select()

      if (error) throw error

      setMessage('Crewmate created successfully! Redirecting to gallery...')
      
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
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h1>Create New Crewmate</h1>
      <p style={{ marginBottom: '2rem' }}>Design your perfect crewmate by choosing their attributes</p>

      {message && (
        <div className={message.includes('Error') ? 'error' : 'success'}>
          {message}
        </div>
      )}

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

        <div className="form-group">
          <label className="form-label">Color</label>
          <div className="attribute-grid">
            {ATTRIBUTES.color.map(color => (
              <div
                key={color}
                className={`attribute-option ${formData.color === color ? 'selected' : ''}`}
                onClick={() => handleAttributeSelect('color', color)}
                style={{ 
                  border: formData.color === color ? '3px solid rgb(102, 126, 234)' : '2px solid rgb(226, 232, 240)',
                  background: formData.color === color ? color.toLowerCase() : 'white',
                  color: formData.color === color ? 'white' : color.toLowerCase(),
                  fontWeight: 'bold'
                }}
              >
                {color}
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Role</label>
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
          <label className="form-label">Personality</label>
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
          <label className="form-label">Primary Skill</label>
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
          <label className="form-label">Bio</label>
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
            background: 'rgb(247, 250, 252)', 
            padding: '1.5rem', 
            borderRadius: '10px',
            border: '2px solid rgb(226, 232, 240)'
          }}>
            <h3>Crewmate Preview</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
              <div 
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: formData.color ? formData.color.toLowerCase() : 'rgb(204, 204, 204)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.5rem'
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
            disabled={loading || !formData.name}
          >
            {loading ? 'Creating...' : 'Create Crewmate'}
          </button>
          <a href="/" className="btn btn-secondary">
            Cancel
          </a>
        </div>
      </form>
    </div>
  )
}