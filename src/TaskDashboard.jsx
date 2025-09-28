// src/TaskDashboard.jsx - UPDATED WITH FETCH
import React, { useState, useEffect, useCallback } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { API_ENDPOINT } from './amplify-config.js';
import CreateTaskForm from './CreateTaskForm.jsx';

const StatusFilters = ['Pending', 'Completed', 'Expired'];

const TaskDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Pending');

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
      console.log('Tasks fetched successfully:', tasksData);
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

  // Handler for marking a task as Completed
  const handleUpdateTask = async (taskId, newStatus) => {
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
              <p><strong>Description:</strong> {task.description}</p>
              <p><strong>Deadline:</strong> {new Date(task.deadline).toLocaleString()}</p>
              <p><strong>Status:</strong> <span style={{ fontWeight: 'bold', color: task.status === 'Pending' ? 'orange' : task.status === 'Completed' ? 'green' : 'red' }}>{task.status}</span></p>

              <div style={{ marginTop: '10px' }}>
                {task.status === 'Pending' && (
                  <>
                    <button
                      onClick={() => handleUpdateTask(task.taskId, 'Completed')}
                      style={{ marginRight: '10px', backgroundColor: 'green', color: 'white', border: 'none', padding: '8px', cursor: 'pointer' }}
                    >
                      Mark Completed
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskDashboard;