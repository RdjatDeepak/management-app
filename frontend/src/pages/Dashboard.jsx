import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI } from '../services/api';
import { 
  ArrowLeft,
  Calendar,
  CheckCircle,
  Clock,
  Circle,
  AlertTriangle,
  User,
  FileText,
  MoreVertical
} from 'lucide-react';

const Dashboard = () => {
  const params = useParams();
  const projectId = params.id;
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState(null);

  const isAdmin = user?.role === 'ROLE_ADMIN';

  useEffect(() => {
    fetchDashboard();
  }, [projectId]);

  const fetchDashboard = async () => {
    try {
      const response = await dashboardAPI.getStats(projectId);
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'No due date';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DONE': return 'status-done';
      case 'IN_PROGRESS': return 'status-progress';
      case 'TODO': return 'status-todo';
      default: return 'status-todo';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'DONE': return <CheckCircle size={14} />;
      case 'IN_PROGRESS': return <Clock size={14} />;
      case 'TODO': return <Circle size={14} />;
      default: return <Circle size={14} />;
    }
  };

const toggleUserExpand = (userEmail) => {
    setExpandedUser(expandedUser === userEmail ? null : userEmail);
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="error-state">
        <h2>Dashboard not found</h2>
        <Link to={`/projects/${projectId}`} className="btn-primary">
          Back to Project
        </Link>
      </div>
    );
  }

  // Calculate percentages for progress bars
  const totalTasks = stats.totalTasks || 0;
  const doneCount = stats.tasksByStatus?.DONE || 0;
  const inProgressCount = stats.tasksByStatus?.IN_PROGRESS || 0;
  const todoCount = stats.tasksByStatus?.TODO || 0;
  const completionRate = totalTasks > 0 ? Math.round((doneCount / totalTasks) * 100) : 0;

  return (
    <div className="dashboard-page">
      <header className="page-header">
        <div className="header-left">
          <Link to={`/projects/${projectId}`} className="back-link">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1>Dashboard</h1>
            <p className="page-subtitle">
              {isAdmin ? 'Project Overview & Team Performance' : 'My Performance'}
            </p>
          </div>
        </div>
      </header>

      {/* Stats Overview Cards */}
      <div className="stats-overview">
        <div className="stat-card stat-total">
          <div className="stat-icon">
            <FileText size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{totalTasks}</span>
            <span className="stat-label">Total Tasks</span>
          </div>
          <div className="stat-progress-ring">
            <svg viewBox="0 0 36 36">
              <path
                className="ring-bg"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="ring-fill"
                strokeDasharray={`${completionRate}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="ring-percent">{completionRate}%</span>
          </div>
        </div>

        <div className="stat-card stat-done">
          <div className="stat-icon">
            <CheckCircle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{doneCount}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>

        <div className="stat-card stat-progress">
          <div className="stat-icon">
            <Clock size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{inProgressCount}</span>
            <span className="stat-label">In Progress</span>
          </div>
        </div>

        <div className="stat-card stat-todo">
          <div className="stat-icon">
            <Circle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{todoCount}</span>
            <span className="stat-label">To Do</span>
          </div>
        </div>

        <div className="stat-card stat-overdue">
          <div className="stat-icon">
            <AlertTriangle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.overdueTasks || 0}</span>
            <span className="stat-label">Overdue</span>
          </div>
        </div>
      </div>

      {/* Team Tasks Table - Admin Only */}
      {isAdmin && stats.userTasks && stats.userTasks.length > 0 && (
        <div className="dashboard-section">
          <h2 className="section-title">
            <User size={20} />
            Team Performance
          </h2>
          
          <div className="team-table-container">
            <table className="team-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Total Tasks</th>
                  <th>Completed</th>
                  <th>In Progress</th>
                  <th>To Do</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stats.userTasks.map((userData, index) => (
                  <>
                    <tr 
                      key={userData.userEmail} 
                      className={`user-row ${expandedUser === userData.userEmail ? 'expanded' : ''}`}
                      onClick={() => toggleUserExpand(userData.userEmail)}
                    >
                      <td>
                        <div className="member-cell">
                          <div className="member-avatar">
                            {userData.userName.charAt(0).toUpperCase()}
                          </div>
                          <div className="member-info">
                            <span className="member-name">{userData.userName}</span>
                            <span className="member-email">{userData.userEmail}</span>
                          </div>
                        </div>
                      </td>
                      <td><span className="task-count">{userData.totalTasks}</span></td>
                      <td>
                        <span className="count-badge done">{userData.completedTasks}</span>
                      </td>
                      <td>
                        <span className="count-badge progress">{userData.inProgressTasks}</span>
                      </td>
                      <td>
                        <span className="count-badge todo">{userData.todoTasks}</span>
                      </td>
                      <td>
                        <button className="expand-btn">
                          <MoreVertical size={16} />
                          <span>{expandedUser === userData.userEmail ? 'Hide' : 'View'} Tasks</span>
                        </button>
                      </td>
                    </tr>
                    {expandedUser === userData.userEmail && (
                      <tr className="expanded-row">
                        <td colSpan={6}>
                          <div className="tasks-detail">
                            <table className="tasks-inner-table">
                              <thead>
                                <tr>
                                  <th>Task Title</th>
                                  <th>Status</th>
                                  <th>Due Date</th>
                                </tr>
                              </thead>
                              <tbody>
                                {userData.tasks.map((task) => (
                                  <tr key={task.taskId}>
                                    <td>
                                      <div className="task-title-cell">
                                        <span className="task-title">{task.title}</span>
                                        {task.description && (
                                          <span className="task-desc">{task.description}</span>
                                        )}
                                      </div>
                                    </td>
                                    <td>
                                      <span className={`status-badge ${getStatusColor(task.status)}`}>
                                        {getStatusIcon(task.status)}
                                        {task.status.replace('_', ' ')}
                                      </span>
                                    </td>
                                    <td>
                                      <div className="due-date-cell">
                                        <Calendar size={14} />
                                        <span>{formatDate(task.dueDate)}</span>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Member View - Personal Stats */}
      {!isAdmin && (
        <div className="dashboard-section">
          <h2 className="section-title">
            <User size={20} />
            My Performance
          </h2>
          <div className="member-performance-grid">
            <div className="perf-card">
              <div className="perf-value">{totalTasks}</div>
              <div className="perf-label">Total Tasks Assigned</div>
            </div>
            <div className="perf-card highlight">
              <div className="perf-value">{completionRate}%</div>
              <div className="perf-label">Completion Rate</div>
            </div>
            <div className="perf-card warning">
              <div className="perf-value">{stats.overdueTasks || 0}</div>
              <div className="perf-label">Overdue Tasks</div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State for Admin */}
      {isAdmin && (!stats.userTasks || stats.userTasks.length === 0) && (
        <div className="empty-state">
          <User size={48} />
          <h3>No Team Members</h3>
          <p>Add members to your project to see their performance here.</p>
          <Link to={`/projects/${projectId}`} className="btn-primary">
            Go to Project
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
