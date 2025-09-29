// src/CreateTaskForm.jsx - MODERNIZED VERSION
import React, { useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { API_ENDPOINT } from './amplify-config.js';

const CreateTaskForm = ({ onTaskCreated }) => {
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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
      setDescription('');
      setDeadline(getDefaultDeadline());
      setIsExpanded(false);
      onTaskCreated();
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Failed to create task. Check console for details.');
    } finally {
      setSubmitting(false);
    }
  };

  // Collapsed state - shows as a button
  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="card"
        style={{
          width: '100%',
          padding: '20px',
          background: 'white',
          border: '2px dashed #d1d5db',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#f9fafb';
          e.currentTarget.style.borderColor = '#667eea';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'white';
          e.currentTarget.style.borderColor = '#d1d5db';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '24px',
            boxShadow: '0 4px 14px rgba(102, 126, 234, 0.25)'
          }}>
            +
          </div>
          <div style={{ textAlign: 'left', flex: 1 }}>
            <h3 style={{ 
              margin: 0, 
              color: '#111827',
              fontSize: '1.125rem',
              fontWeight: '700',
              marginBottom: '4px'
            }}>
              Create New Task
            </h3>
            <p style={{ 
              margin: 0, 
              color: '#6b7280',
              fontSize: '0.95rem'
            }}>
              Click here to add a new task
            </p>
          </div>
          <div style={{
            width: '36px',
            height: '36px',
            background: '#f3f4f6',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '18px', color: '#667eea' }}>+</span>
          </div>
        </div>
      </button>
    );
  }

  // Expanded state - shows the form
  return (
    <div className="card" style={{ padding: '24px', position: 'relative' }}>
      <button
        onClick={() => setIsExpanded(false)}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          border: 'none',
          background: '#f3f4f6',
          color: '#4b5563',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
          transition: 'all 0.2s',
          fontWeight: 'bold'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#e5e7eb';
          e.currentTarget.style.color = '#1f2937';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#f3f4f6';
          e.currentTarget.style.color = '#4b5563';
        }}
      >
        ✕
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '24px',
          boxShadow: '0 4px 14px rgba(102, 126, 234, 0.25)'
        }}>
          +
        </div>
        <div>
          <h3 style={{ 
            margin: 0, 
            color: '#111827',
            fontSize: '1.25rem',
            fontWeight: '700'
          }}>
            Create New Task
          </h3>
          <p style={{ 
            margin: '4px 0 0 0', 
            color: '#6b7280',
            fontSize: '0.95rem'
          }}>
            Fill in the details below
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '10px',
            fontWeight: '600',
            color: '#374151',
            fontSize: '0.875rem',
            letterSpacing: '0.025em'
          }}>
            Task Description *
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-modern"
            placeholder="e.g., Complete project proposal"
            required
          />
        </div>
        
        <div style={{ marginBottom: '28px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '10px',
            fontWeight: '600',
            color: '#374151',
            fontSize: '0.875rem',
            letterSpacing: '0.025em'
          }}>
            Deadline *
          </label>
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="input-modern"
            required
          />
          <p style={{
            margin: '8px 0 0 0',
            fontSize: '0.75rem',
            color: '#9ca3af'
          }}>
            Set a realistic deadline to help you stay on track
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            type="submit" 
            disabled={submitting} 
            className="btn btn-primary"
            style={{ 
              flex: 1,
              padding: '14px 24px',
              fontSize: '0.9375rem'
            }}
          >
            {submitting ? (
              <>
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid transparent',
                  borderTop: '2px solid currentColor',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite'
                }}></div>
                Creating Task...
              </>
            ) : (
              <>
                <span style={{ fontSize: '18px' }}>✓</span>
                Create Task
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => setIsExpanded(false)}
            className="btn btn-outline"
            style={{ padding: '14px 24px' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTaskForm;