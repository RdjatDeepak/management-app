import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Folder, Users, ChevronRight } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [creating, setCreating] = useState(false);
  const { user } = useAuth();

  const isAdmin = user?.role === 'ROLE_ADMIN';

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectAPI.getAll();
      setProjects(response.data);
    } catch (err) {
      setError('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const response = await projectAPI.create(newProject);
      setProjects([...projects, response.data]);
      setShowModal(false);
      setNewProject({ name: '', description: '' });
    } catch (err) {
      setError('Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading projects...</div>;
  }

  return (
    <div className="projects-page">
      <header className="page-header">
        <div>
          <h1>Projects</h1>
          <p className="page-subtitle">Manage your team projects</p>
        </div>
        {isAdmin && (
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} />
            New Project
          </button>
        )}
      </header>

      {error && <div className="error-banner">{error}</div>}

      {projects.length === 0 ? (
        <div className="empty-state">
          <Folder size={48} />
          <h3>No projects yet</h3>
          <p>Create your first project to get started</p>
          {isAdmin && (
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={18} />
              Create Project
            </button>
          )}
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <Link 
              key={project.id} 
              to={`/projects/${project.id}`}
              className="project-card"
            >
              <div className="project-icon">
                <Folder size={24} />
              </div>
              <div className="project-info">
                <h3>{project.name}</h3>
                <p>{project.description || 'No description'}</p>
              </div>
              <ChevronRight size={20} className="project-arrow" />
            </Link>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Project</h2>
            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label htmlFor="projectName">Project Name</label>
                <input
                  type="text"
                  id="projectName"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="Enter project name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="projectDesc">Description</label>
                <textarea
                  id="projectDesc"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Enter project description"
                  rows={3}
                />
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={creating}
                >
                  {creating ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
