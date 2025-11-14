function CrewmateGallery() {
  const [crewmates, setCrewmates] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')

  React.useEffect(() => {
    fetchCrewmates()
  }, [])

  const fetchCrewmates = async () => {
    try {
      const { supabase } = await import('../supabaseClient.js')
      
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
      const { supabase } = await import('../supabaseClient.js')
      
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
      <div className="loading">Loading your crewmates...</div>
    </div>
  )

  if (error) return (
    <div className="card">
      <div className="error">Error: {error}</div>
    </div>
  )

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Your Crewmate Gallery</h1>
        <a href="/create" className="btn btn-primary">
          + New Crewmate
        </a>
      </div>

      <p>You have {crewmates.length} crewmate{crewmates.length !== 1 ? 's' : ''} in your crew</p>
      
      <div className="crewmate-grid">
        {crewmates.map(crewmate => (
          <div key={crewmate.id} className="crewmate-card">
            <div 
              className="crewmate-avatar"
              style={{ 
                backgroundColor: crewmate.color ? crewmate.color.toLowerCase() : 'rgb(102, 126, 234)'
              }}
            >
              {crewmate.name?.charAt(0) || 'C'}
            </div>
            <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>{crewmate.name}</h3>
            <div style={{ marginBottom: '1rem' }}>
              <span className="attribute-badge">{crewmate.role}</span>
              <span className="attribute-badge">{crewmate.color}</span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'rgb(102, 102, 102)', marginBottom: '1.5rem' }}>
              {crewmate.bio || 'No bio provided'}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                View Details
              </button>
              <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem' }}>
                Edit
              </button>
              <button 
                onClick={() => handleDelete(crewmate.id)}
                className="btn btn-danger" 
                style={{ padding: '0.5rem 1rem' }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {crewmates.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h3>No crewmates yet!</h3>
          <p style={{ margin: '1rem 0' }}>Create your first crewmate to get started.</p>
          <a href="/create" className="btn btn-primary">
            Create Your First Crewmate
          </a>
        </div>
      )}
    </div>
  )
}