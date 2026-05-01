import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectAPI, taskAPI, dashboardAPI } from '../services/api';
import { 
  Plus, 
  Users, 
  CheckSquare, 
  BarChart3,
  ArrowLeft,
  Calendar,
  Flag,
  CheckCircle,
  Clock,
  Circle,
  MoreVertical
} from 'lucide-react';

const ProjectDetail = () => {
  const params = useParams();
  const projectId = params.id;
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleNavigateToDashboard = () => {
    navigate(`/projects/${projectId}/dashboard`);
  };
  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tasks');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'MEDIUM',
    assignedToUserId: null
  });
  const [newMember, setNewMember] = useState({
    email: '',
    password: '',
    name: '',
    teamRole: 'MEMBER',
    canCreateTasks: false,
    canUpdateStatus: false
  });
  const [saving, setSaving] = useState(false);

  // Check if user is project admin (compare admin email from project)
  const isProjectAdmin = project?.admin?.email === user?.email;

  useEffect(() => {
    fetchProjectData();
  }, [projectId]);

const fetchProjectData = async () => {
    try {
      const [projectRes, tasksRes, statsRes, membersRes] = await Promise.all([
        projectAPI.getById(projectId),
        taskAPI.getByProject(projectId),
        dashboardAPI.getStats(projectId),
        projectAPI.getMembers(projectId)
      ]);
      setProject(projectRes.data);
      setTasks(tasksRes.data);
      setStats(statsRes.data);
      setMembers(membersRes.data || []);
    } catch (err) {
      console.error('Failed to fetch project data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Ensure assignedToUserId is sent as a number, not a string
      const assignedToUserIdNum = parseInt(newTask.assignedToUserId, 10);
      if (isNaN(assignedToUserIdNum)) {
        alert('Please select a team member to assign this task to');
        setSaving(false);
        return;
      }
      
      const taskData = {
        title: newTask.title,
        description: newTask.description,
        dueDate: newTask.dueDate || null,
        priority: newTask.priority,
        assignedToUserId: assignedToUserIdNum
      };
      const response = await taskAPI.create(projectId, taskData);
      setTasks([...tasks, response.data]);
      setShowTaskModal(false);
      setNewTask({ title: '', description: '', dueDate: '', priority: 'MEDIUM', assignedToUserId: null });
    } catch (err) {
      console.error('Failed to create task:', err);
      alert(err.response?.data?.message || 'Failed to create task. Make sure you are the project admin.');
    } finally {
      setSaving(false);
    }
  };

const handleAddMember = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await projectAPI.addMember(projectId, newMember);
      // Refresh the members list after adding a new member
      const membersRes = await projectAPI.getMembers(projectId);
      setMembers(membersRes.data || []);
      setShowMemberModal(false);
      setNewMember({
        email: '',
        password: '',
        name: '',
        teamRole: 'MEMBER',
        canCreateTasks: false,
        canUpdateStatus: false
      });
    } catch (err) {
      console.error('Failed to add member:', err);
      alert(err.response?.data?.message || 'Failed to add member. Only the project admin can add members.');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await taskAPI.updateStatus(taskId, newStatus);
      setTasks(tasks.map(t => t.id === taskId ? response.data : t));
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'priority-high';
      case 'MEDIUM': return 'priority-medium';
      case 'LOW': return 'priority-low';
      default: return '';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'DONE': return <CheckCircle size={18} className="status-done" />;
      case 'IN_PROGRESS': return <Clock size={18} className="status-progress" />;
      default: return <Circle size={18} className="status-todo" />;
    }
  };

  const formatDate = (date) => {
    if (!date) return 'No due date';
    return new Date(date).toLocaleDateString();
  };

  const isOverdue = (date) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  if (loading) {
    return <div className="loading">Loading project...</div>;
  }

  if (!project) {
    return (
      <div className="error-state">
        <h2>Project not found</h2>
        <Link to="/" className="btn-primary">Back to Projects</Link>
      </div>
    );
  }

return (
    <div className="project-detail-page">
      {/* Page Header with navigation and action buttons */}
      <header className="page-header">
        <div className="header-left">
          <Link to="/" className="back-link">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1>{project.name}</h1>
            <p className="page-subtitle">{project.description || 'Manage tasks and team members'}</p>
          </div>
        </div>
        <div className="header-actions">
          {/* Add Member Button - Only visible to project admin */}
          {isProjectAdmin && (
            <button className="btn-secondary" onClick={() => setShowMemberModal(true)}>
              <Users size={18} />
              Add Team Member
            </button>
          )}
          {/* Add Task Button - Only visible to project admin */}
          {isProjectAdmin && (
            <button className="btn-primary" onClick={() => setShowTaskModal(true)}>
              <Plus size={18} />
              Create New Task
            </button>
          )}
        </div>
      </header>

      {/* Stats Overview Cards */}
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.totalTasks || 0}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.tasksByStatus?.DONE || 0}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.tasksByStatus?.IN_PROGRESS || 0}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.tasksByStatus?.TODO || 0}</div>
            <div className="stat-label">To Do</div>
          </div>
          <div className="stat-card stat-overdue">
            <div className="stat-value">{stats.overdueTasks || 0}</div>
            <div className="stat-label">Overdue</div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          <CheckSquare size={18} />
          View Tasks
        </button>
        <button 
          className={`tab`}
          onClick={handleNavigateToDashboard}
        >
          <BarChart3 size={18} />
          View Dashboard
        </button>
      </div>

      {/* Tasks List */}
      {activeTab === 'tasks' && (
        <div className="tasks-container">
          {tasks.length === 0 ? (
<div className="empty-state">
              <CheckSquare size={48} />
              <h3>No tasks yet</h3>
              <p>Add your first task to this project</p>
              <button className="btn-primary" onClick={() => setShowTaskModal(true)}>
                <Plus size={18} />
                Add Task
              </button>
            </div>
          ) : (
            <div className="tasks-list">
              {tasks.map((task) => (
                <div key={task.id} className={`task-card ${task.status?.toLowerCase()}`}>
                  <div className="task-header">
                    <button 
                      className="status-btn"
                      onClick={() => {
                        const nextStatus = task.status === 'TODO' ? 'IN_PROGRESS' : task.status === 'IN_PROGRESS' ? 'DONE' : 'TODO';
                        handleStatusChange(task.id, nextStatus);
                      }}
                    >
                      {getStatusIcon(task.status)}
                    </button>
                    <div className="task-title">
                      <span className={task.status === 'DONE' ? 'completed' : ''}>{task.title}</span>
                      <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                        <Flag size={12} />
                        {task.priority}
                      </span>
                    </div>
                  </div>
                  {task.description && (
                    <p className="task-description">{task.description}</p>
                  )}
                  <div className="task-meta">
                    <span className={`due-date ${isOverdue(task.dueDate) && task.status !== 'DONE' ? 'overdue' : ''}`}>
                      <Calendar size={14} />
                      {formatDate(task.dueDate)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
</div>
      )}

      {/* Create Task Modal */}
      {showTaskModal && (
        <div className="modal-overlay" onClick={() => setShowTaskModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label htmlFor="taskTitle">Title</label>
                <input
                  type="text"
                  id="taskTitle"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Enter task title"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="taskDesc">Description</label>
                <textarea
                  id="taskDesc"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Enter task description"
                  rows={3}
                />
              </div>
<div className="form-row">
                <div className="form-group">
                  <label htmlFor="dueDate">Due Date</label>
                  <input
                    type="date"
                    id="dueDate"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="priority">Priority</label>
                  <select
                    id="priority"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="assignMember">Assign To</label>
                <select
                  id="assignMember"
                  value={newTask.assignedToUserId || ''}
                  onChange={(e) => setNewTask({ ...newTask, assignedToUserId: e.target.value })}
                  required
                >
                  <option value="">Select a team member</option>
                  {members.map((member) => (
                    <option key={member.user?.id} value={member.user?.id}>
                      {member.user?.name || member.user?.email}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setShowTaskModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={saving}
                >
                  {saving ? 'Adding...' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showMemberModal && (
        <div className="modal-overlay" onClick={() => setShowMemberModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Add Team Member</h2>
            <form onSubmit={handleAddMember}>
              <div className="form-group">
                <label htmlFor="memberName">Name</label>
                <input
                  type="text"
                  id="memberName"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  placeholder="Enter member name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="memberEmail">Email</label>
                <input
                  type="email"
                  id="memberEmail"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  placeholder="Enter member email"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="memberPassword">Temporary Password</label>
                <input
                  type="password"
                  id="memberPassword"
                  value={newMember.password}
                  onChange={(e) => setNewMember({ ...newMember, password: e.target.value })}
                  placeholder="Set temporary password"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="teamRole">Team Role</label>
                <select
                  id="teamRole"
                  value={newMember.teamRole}
                  onChange={(e) => setNewMember({ ...newMember, teamRole: e.target.value })}
                >
                  <option value="MEMBER">Member</option>
                  <option value="LEADER">Team Leader</option>
                </select>
              </div>
              <div className="form-row checkboxes">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={newMember.canCreateTasks}
                    onChange={(e) => setNewMember({ ...newMember, canCreateTasks: e.target.checked })}
                  />
                  Can Create Tasks
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={newMember.canUpdateStatus}
                    onChange={(e) => setNewMember({ ...newMember, canUpdateStatus: e.target.checked })}
                  />
                  Can Update Status
                </label>
              </div>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setShowMemberModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={saving}
                >
                  {saving ? 'Adding...' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
