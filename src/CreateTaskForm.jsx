// src/CreateTaskForm.jsx - UPDATED WITH FETCH
import React, { useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { API_ENDPOINT } from './amplify-config.js';

const CreateTaskForm = ({ onTaskCreated }) => {
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Helper function to get authentication token
  const getAuthToken = async () => {
    try {
      const { idToken } = (await fetchAuthSession()).tokens ?? {};
      return idToken.toString();
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  };

  // Helper function to get an ISO date 5 minutes from now for a default deadline
  const getDefaultDeadline = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5); 
    return now.toISOString().slice(0, 16); 
  };
  
  // Set default deadline on initial render
  React.useEffect(() => {
    if (!deadline) {
      setDeadline(getDefaultDeadline());
    }
  }, [deadline]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Format deadline to ISO 8601 string expected by Lambda
    const deadlineISO = new Date(deadline).toISOString();

    try {
      
      const token = await getAuthToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`${API_ENDPOINT}/tasks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description, deadline: deadlineISO })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      alert('Task created successfully!');
      setDescription('');
      setDeadline(getDefaultDeadline());
      onTaskCreated();
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task. Check console for details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ border: '1px solid #007bff', padding: '20px', borderRadius: '5px' }}>
      <h3>Create New Task</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="description" style={{ display: 'block' }}>Description:</label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="deadline" style={{ display: 'block' }}>Deadline:</label>
          <input
            id="deadline"
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <button type="submit" disabled={submitting} style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
          {submitting ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </div>
  );
};

export default CreateTaskForm;