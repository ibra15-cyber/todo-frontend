// src/TaskDashboard.jsx - IMPROVED READABILITY VERSION
import React, { useState, useEffect, useCallback } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { API_ENDPOINT } from './amplify-config.js';
import CreateTaskForm from './CreateTaskForm.jsx';

const StatusFilters = ['Pending', 'Completed', 'Expired'];

const TaskDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Pending');
  const [editingTask, setEditingTask] = useState(null);
  const [editDescription, setEditDescription] = useState('');
  const [editDeadline, setEditDeadline] = useState('');

  // Function to get authentication token
  const getAuthToken = async () => {
    try {
      const { idToken } = (await fetchAuthSession()).tokens ?? {};
      return idToken.toString();
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  };

  // Function to fetch all tasks
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`${API_ENDPOINT}/tasks`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const tasksData = await response.json();
      setTasks(Array.isArray(tasksData) ? tasksData : []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      alert('Failed to load tasks. Check console for details.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Handler for editing a task
  const handleEditTask = (task) => {
    setEditingTask(task.taskId);
    setEditDescription(task.description);
    const deadlineDate = new Date(task.deadline);
    const localDateTime = deadlineDate.toISOString().slice(0, 16);
    setEditDeadline(localDateTime);
  };

  // Handler for saving edited task
  const handleSaveEdit = async (taskId) => {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_ENDPOINT}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          description: editDescription,
          deadline: new Date(editDeadline).toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setEditingTask(null);
      setEditDescription('');
      setEditDeadline('');
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task.');
    }
  };

  // Handler for canceling edit
  const handleCancelEdit = () => {
    setEditingTask(null);
    setEditDescription('');
    setEditDeadline('');
  };

  // Handler for marking a task as Completed
  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_ENDPOINT}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task.');
    }
  };

  // Handler for deleting a task
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    
    try {
      const token = await getAuthToken();
      const response = await fetch(`${API_ENDPOINT}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task.');
    }
  };

  const filteredTasks = Array.isArray(tasks) ? tasks.filter(task => task.status === filter) : [];

  // Get task counts for each status
  const taskCounts = {
    Pending: tasks.filter(t => t.status === 'Pending').length,
    Completed: tasks.filter(t => t.status === 'Completed').length,
    Expired: tasks.filter(t => t.status === 'Expired').length
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p style={{ color: '#4b5563', fontSize: '1rem', fontWeight: '500' }}>
          Loading your tasks...
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Stats Overview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '2.25rem', fontWeight: '700', color: '#fbfbfdff', marginBottom: '4px' }}>
            {tasks.length}
          </div>
          <div style={{ fontSize: '0.95rem', color: '#4b5563', fontWeight: '600' }}>
            Total Tasks
          </div>
        </div>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '2.25rem', fontWeight: '700', color: '#f59e0b', marginBottom: '4px' }}>
            {taskCounts.Pending}
          </div>
          <div style={{ fontSize: '0.95rem', color: '#4b5563', fontWeight: '600' }}>
            Pending
          </div>
        </div>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '2.25rem', fontWeight: '700', color: '#10b981', marginBottom: '4px' }}>
            {taskCounts.Completed}
          </div>
          <div style={{ fontSize: '0.95rem', color: '#4b5563', fontWeight: '600' }}>
            Completed
          </div>
        </div>
      </div>

      {/* Create Task Form */}
      <div style={{ marginBottom: '24px' }} className="fade-in">
        <CreateTaskForm onTaskCreated={fetchTasks} />
      </div>

      {/* Task List Section */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{
          background: 'linear-gradient(to bottom, #f9fafb, white)',
          borderBottom: '1px solid #e5e7eb',
          padding: '20px 24px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ 
                margin: 0, 
                color: '#111827',
                fontSize: '1.5rem',
                fontWeight: '700'
              }}>
                Your Tasks
              </h2>
              <p style={{ 
                margin: '4px 0 0 0', 
                color: '#6b7280',
                fontSize: '0.95rem'
              }}>
                Manage your task list
              </p>
            </div>
          </div>
        </div>

        {/* Status Filters */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          padding: '20px 24px',
          borderBottom: '1px solid #e5e7eb',
          flexWrap: 'wrap',
          background: 'white'
        }}>
          {StatusFilters.map(s => {
            const count = taskCounts[s];
            const isActive = filter === s;
            
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className="btn"
                style={{
                  padding: '10px 20px',
                  background: isActive 
                    ? 'linear-gradient(135deg, #667eea, #764ba2)' 
                    : '#f3f4f6',
                  color: isActive ? 'white' : '#1f2937',
                  fontSize: '0.95rem',
                  boxShadow: isActive ? '0 2px 8px rgba(102, 126, 234, 0.3)' : 'none'
                }}
              >
                {s}
                <span style={{
                  padding: '3px 9px',
                  borderRadius: '6px',
                  background: isActive 
                    ? 'rgba(255, 255, 255, 0.25)' 
                    : '#d1d5db',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  color: isActive ? 'white' : '#1f2937'
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Task List */}
        <div style={{ padding: '24px' }}>
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <div style={{ 
                fontSize: '3.5rem',
                marginBottom: '16px',
                opacity: 0.4
              }}>
                {filter === 'Pending' ? '📝' : filter === 'Completed' ? '✅' : '⏰'}
              </div>
              <h3>No {filter.toLowerCase()} tasks</h3>
              <p>
                {filter === 'Pending' 
                  ? 'Create your first task to get started!' 
                  : filter === 'Completed'
                  ? 'Complete some tasks to see them here'
                  : 'No expired tasks - great job!'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredTasks.map((task, index) => (
                <div 
                  key={task.taskId} 
                  className="card fade-in" 
                  style={{ 
                    padding: '24px',
                    animationDelay: `${index * 0.05}s`,
                    border: editingTask === task.taskId ? '2px solid #667eea' : undefined
                  }}
                >
                  {editingTask === task.taskId ? (
                    // Edit Mode
                    <div>
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: '8px',
                          fontWeight: '600',
                          color: '#1f2937',
                          fontSize: '0.95rem'
                        }}>
                          Description
                        </label>
                        <input
                          type="text"
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="input-modern"
                          placeholder="Enter task description..."
                        />
                      </div>
                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ 
                          display: 'block', 
                          marginBottom: '8px',
                          fontWeight: '600',
                          color: '#1f2937',
                          fontSize: '0.95rem'
                        }}>
                          Deadline
                        </label>
                        <input
                          type="datetime-local"
                          value={editDeadline}
                          onChange={(e) => setEditDeadline(e.target.value)}
                          className="input-modern"
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button
                          onClick={() => handleSaveEdit(task.taskId)}
                          className="btn btn-success"
                        >
                          💾 Save Changes
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="btn btn-secondary"
                        >
                          ✕ Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'flex-start', 
                        marginBottom: '16px',
                        gap: '16px'
                      }}>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ 
                            margin: '0 0 12px 0', 
                            color: '#111827',
                            fontSize: '1.125rem',
                            fontWeight: '600',
                            lineHeight: '1.5'
                          }}>
                            {task.description}
                          </h3>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '16px', 
                            flexWrap: 'wrap' 
                          }}>
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '8px',
                              padding: '6px 12px',
                              background: '#f9fafb',
                              borderRadius: '8px',
                              border: '1px solid #e5e7eb'
                            }}>
                              <span style={{ fontSize: '1rem' }}>📅</span>
                              <span style={{ 
                                color: '#1f2937', 
                                fontSize: '0.95rem',
                                fontWeight: '500'
                              }}>
                                {new Date(task.deadline).toLocaleString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <span className={`status-badge status-${task.status.toLowerCase()}`}>
                              {task.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div style={{ 
                        display: 'flex', 
                        gap: '10px', 
                        flexWrap: 'wrap',
                        paddingTop: '16px',
                        borderTop: '1px solid #e5e7eb'
                      }}>
                        {task.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateTaskStatus(task.taskId, 'Completed')}
                              className="btn btn-success"
                              style={{ fontSize: '0.95rem' }}
                            >
                              ✓ Complete
                            </button>
                            <button
                              onClick={() => handleEditTask(task)}
                              className="btn btn-primary"
                              style={{ fontSize: '0.95rem' }}
                            >
                              ✏️ Edit
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDeleteTask(task.taskId)}
                          className="btn btn-danger"
                          style={{ fontSize: '0.95rem' }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDashboard;