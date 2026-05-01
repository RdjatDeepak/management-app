import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI } from '../services/api';
import { 
  BarChart3, 
  Users, 
  CheckCircle, 
  Clock, 
  Circle,
  AlertTriangle,
  ArrowLeft,
  TrendingUp,
  Activity
} from 'lucide-react';

const Dashboard = () => {
  const params = useParams();
  const projectId = params.id;
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);

  const isAdmin = user?.role === 'ROLE_ADMIN';

  useEffect(() => {
    fetchDashboard();
  }, [projectId]);

  const fetchDashboard = async () => {
    try {
      const response = await dashboardAPI.getStats(projectId);
      setStats(response.data);
      // Set project info from the response (we need to get project details too)
      if (response.data) {
        setProject({ id: projectId });
      }
    } catch (err) {
      console.error('Failed to fetch dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'No due date';
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
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

  // User-specific data (for members)
  const userTasks = stats.tasksPerUser ? Object.entries(stats.tasksPerUser) : [];

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
              {isAdmin ? 'Project Overview' : 'My Performance'}
            </p>
          </div>
        </div>
      </header>

      {/* Overview Stats */}
      <div className="dashboard-overview">
        <div className="overview-card main">
          <div className="overview-icon">
            <Activity size={24} />
          </div>
          <div className="overview-content">
            <div className="overview-value">{totalTasks}</div>
            <div className="overview-label">Total Tasks</div>
          </div>
          <div className="overview-progress">
            <div className="progress-ring">
              <svg viewBox="0 0 36 36">
                <path
                  className="progress-ring-bg"
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="progress-ring-fill"
                  strokeDasharray={`${completionRate}, 100`}
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="progress-text">{completionRate}%</div>
            </div>
          </div>
        </div>

        <div className="overview-card done">
          <div className="overview-icon">
            <CheckCircle size={24} />
          </div>
          <div className="overview-content">
            <div className="overview-value">{doneCount}</div>
            <div className="overview-label">Completed</div>
          </div>
        </div>

        <div className="overview-card progress">
          <div className="overview-icon">
            <Clock size={24} />
          </div>
          <div className="overview-content">
            <div className="overview-value">{inProgressCount}</div>
            <div className="overview-label">In Progress</div>
          </div>
        </div>

        <div className="overview-card todo">
          <div className="overview-icon">
            <Circle size={24} />
          </div>
          <div className="overview-content">
            <div className="overview-value">{todoCount}</div>
            <div className="overview-label">To Do</div>
          </div>
        </div>

        <div className="overview-card overdue">
          <div className="overview-icon">
            <AlertTriangle size={24} />
          </div>
          <div className="overview-content">
            <div className="overview-value">{stats.overdueTasks || 0}</div>
            <div className="overview-label">Overdue</div>
          </div>
        </div>
      </div>

      {/* Tasks by Status - Visual Chart */}
      <div className="dashboard-section">
        <h2>
          <TrendingUp size={20} />
          Tasks by Status
        </h2>
        <div className="status-chart">
          <div className="chart-row">
            <div className="chart-label">To Do</div>
            <div className="chart-bar-container">
              <div 
                className="chart-bar todo"
                style={{ width: `${totalTasks > 0 ? (todoCount / totalTasks) * 100 : 0}%` }}
              />
            </div>
            <div className="chart-value">{todoCount}</div>
          </div>
          <div className="chart-row">
            <div className="chart-label">In Progress</div>
            <div className="chart-bar-container">
              <div 
                className="chart-bar progress"
                style={{ width: `${totalTasks > 0 ? (inProgressCount / totalTasks) * 100 : 0}%` }}
              />
            </div>
            <div className="chart-value">{inProgressCount}</div>
          </div>
          <div className="chart-row">
            <div className="chart-label">Done</div>
            <div className="chart-bar-container">
              <div 
                className="chart-bar done"
                style={{ width: `${totalTasks > 0 ? (doneCount / totalTasks) * 100 : 0}%` }}
              />
            </div>
            <div className="chart-value">{doneCount}</div>
          </div>
        </div>
      </div>

      {/* Team Performance - Admin Only */}
      {isAdmin && stats.tasksPerUser && (
        <div className="dashboard-section">
          <h2>
            <Users size={20} />
            Team Performance
          </h2>
          <div className="team-grid">
            {Object.entries(stats.tasksPerUser).map(([userName, taskCount]) => (
              <div key={userName} className="team-card">
                <div className="team-avatar">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="team-info">
                  <div className="team-name">{userName}</div>
                  <div className="team-tasks">{taskCount} tasks</div>
                </div>
                <div className="team-stat">
                  {taskCount > 0 ? (
                    <span className="stat-badge active">
                      <Activity size={14} />
                      Active
                    </span>
                  ) : (
                    <span className="stat-badge idle">Idle</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Member View - Personal Stats */}
      {!isAdmin && (
        <div className="dashboard-section">
          <h2>
            <BarChart3 size={20} />
            My Performance
          </h2>
          <div className="member-stats">
            <div className="stat-item">
              <div className="stat-number">{totalTasks}</div>
              <div className="stat-desc">Total tasks assigned</div>
            </div>
            <div className="stat-item">
              <div className="stat-number highlight">{completionRate}%</div>
              <div className="stat-desc">Completion rate</div>
            </div>
            <div className="stat-item">
              <div className="stat-number warning">{stats.overdueTasks || 0}</div>
              <div className="stat-desc">Overdue tasks</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
