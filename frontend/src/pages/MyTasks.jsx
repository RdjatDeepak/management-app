import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { taskAPI } from '../services/api';
import { 
  CheckCircle, 
  Clock, 
  Circle, 
  Calendar,
  Flag,
  Folder
} from 'lucide-react';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await taskAPI.getMyTasks();
      setTasks(response.data);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
    } finally {
      setLoading(false);
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

  const filteredTasks = tasks.filter(task => {
    if (filter === 'ALL') return true;
    return task.status === filter;
  });

  const todoTasks = tasks.filter(t => t.status === 'TODO');
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS');
  const doneTasks = tasks.filter(t => t.status === 'DONE');

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

return (
    <div className="my-tasks-page">
      <header className="page-header">
        <div className="header-left">
          <div>
            <h1>My Tasks</h1>
            <p className="page-subtitle">View and manage your assigned tasks</p>
          </div>
        </div>
      </header>

      {/* Task Summary Cards - Shows task status overview */}
      <div className="task-summary">
        <div className="summary-card" onClick={() => setFilter('ALL')}>
          <div className="summary-value">{tasks.length}</div>
          <div className="summary-label">Total Tasks</div>
        </div>
        <div className="summary-card todo" onClick={() => setFilter('TODO')}>
          <div className="summary-value">{todoTasks.length}</div>
          <div className="summary-label">To Do</div>
        </div>
        <div className="summary-card progress" onClick={() => setFilter('IN_PROGRESS')}>
          <div className="summary-value">{inProgressTasks.length}</div>
          <div className="summary-label">In Progress</div>
        </div>
        <div className="summary-card done" onClick={() => setFilter('DONE')}>
          <div className="summary-value">{doneTasks.length}</div>
          <div className="summary-label">Completed</div>
        </div>
      </div>

      {/* Filter */}
      <div className="filter-tabs">
        <button 
          className={`filter-tab ${filter === 'ALL' ? 'active' : ''}`}
          onClick={() => setFilter('ALL')}
        >
          All
        </button>
        <button 
          className={`filter-tab ${filter === 'TODO' ? 'active' : ''}`}
          onClick={() => setFilter('TODO')}
        >
          To Do
        </button>
        <button 
          className={`filter-tab ${filter === 'IN_PROGRESS' ? 'active' : ''}`}
          onClick={() => setFilter('IN_PROGRESS')}
        >
          In Progress
        </button>
        <button 
          className={`filter-tab ${filter === 'DONE' ? 'active' : ''}`}
          onClick={() => setFilter('DONE')}
        >
          Done
        </button>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          <CheckCircle size={48} />
          <h3>No tasks found</h3>
          <p>
            {filter === 'ALL' 
              ? 'You have no tasks yet' 
              : `No ${filter.toLowerCase().replace('_', ' ')} tasks`}
          </p>
        </div>
      ) : (
        <div className="tasks-list">
          {filteredTasks.map((task) => (
            <div key={task.id} className={`task-card ${task.status?.toLowerCase()}`}>
              <div className="task-header">
                <button 
                  className="status-btn"
                  onClick={() => {
                    const nextStatus = task.status === 'TODO' 
                      ? 'IN_PROGRESS' 
                      : task.status === 'IN_PROGRESS' 
                        ? 'DONE' 
                        : 'TODO';
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
              <div className="task-footer">
                {task.project && (
                  <Link to={`/projects/${task.project.id}`} className="project-link">
                    <Folder size={14} />
                    {task.project.name}
                  </Link>
                )}
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
  );
};

export default MyTasks;
