// src/TaskDashboard.jsx - UPDATED WITH EDIT FUNCTIONALITY
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

  // Function to fetch all tasks using fetch API
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      console.log('Fetching tasks from API...');
      
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
    // Convert ISO deadline to datetime-local format
    const deadlineDate = new Date(task.deadline);
    const localDateTime = deadlineDate.toISOString().slice(0, 16);
    setEditDeadline(localDateTime);
  };

  // Handler for saving edited task
  const handleSaveEdit = async (taskId) => {
    try {
      console.log('Saving edits for task:', taskId);
      
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

      console.log('Task updated successfully');
      setEditingTask(null);
      setEditDescription('');
      setEditDeadline('');
      fetchTasks(); // Refresh list
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
      console.log('Updating task:', taskId, 'to status:', newStatus);
      
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

      console.log('Task updated successfully');
      fetchTasks(); // Refresh list
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task.');
    }
  };

  // Handler for deleting a task
  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    
    try {
      console.log('Deleting task:', taskId);
      
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

      console.log('Task deleted successfully');
      fetchTasks(); // Refresh list
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task.');
    }
  };

  const filteredTasks = Array.isArray(tasks) ? tasks.filter(task => task.status === filter) : [];

  if (loading) return <p>Loading tasks...</p>;

  return (
    <div>
      <CreateTaskForm onTaskCreated={fetchTasks} />

      <h2 style={{marginTop: '30px'}}>Task List</h2>

      {/* Status Filters */}
      <div style={{ marginBottom: '20px' }}>
        {StatusFilters.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              marginRight: '10px',
              padding: '8px 15px',
              backgroundColor: filter === s ? '#007bff' : '#f0f0f0',
              color: filter === s ? 'white' : 'black',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {s} ({Array.isArray(tasks) ? tasks.filter(t => t.status === s).length : 0})
          </button>
        ))}
      </div>

      {filteredTasks.length === 0 ? (
        <p>No {filter} tasks found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {filteredTasks.map(task => (
            <li key={task.taskId} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '10px', borderRadius: '5px' }}>
              {editingTask === task.taskId ? (
                // Edit Mode
                <div>
                  <div style={{ marginBottom: '10px' }}>
                    <label htmlFor={`edit-desc-${task.taskId}`} style={{ display: 'block' }}>Description:</label>
                    <input
                      id={`edit-desc-${task.taskId}`}
                      type="text"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <label htmlFor={`edit-deadline-${task.taskId}`} style={{ display: 'block' }}>Deadline:</label>
                    <input
                      id={`edit-deadline-${task.taskId}`}
                      type="datetime-local"
                      value={editDeadline}
                      onChange={(e) => setEditDeadline(e.target.value)}
                      style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ marginTop: '10px' }}>
                    <button
                      onClick={() => handleSaveEdit(task.taskId)}
                      style={{ marginRight: '10px', backgroundColor: 'green', color: 'white', border: 'none', padding: '8px', cursor: 'pointer' }}
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      style={{ backgroundColor: 'gray', color: 'white', border: 'none', padding: '8px', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <>
                  <p><strong>Description:</strong> {task.description}</p>
                  <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleString()}</p>
                  <p><strong>Status:</strong> <span style={{ fontWeight: 'bold', color: task.status === 'Pending' ? 'orange' : task.status === 'Completed' ? 'green' : 'red' }}>{task.status}</span></p>

                  <div style={{ marginTop: '10px' }}>
                    {task.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateTaskStatus(task.taskId, 'Completed')}
                          style={{ marginRight: '10px', backgroundColor: 'green', color: 'white', border: 'none', padding: '8px', cursor: 'pointer' }}
                        >
                          Mark Completed
                        </button>
                        <button
                          onClick={() => handleEditTask(task)}
                          style={{ marginRight: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', padding: '8px', cursor: 'pointer' }}
                        >
                          Edit
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleDeleteTask(task.taskId)}
                      style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '8px', cursor: 'pointer' }}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskDashboard;