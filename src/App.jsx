// src/App.jsx - MODERNIZED VERSION
import React from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import TaskDashboard from './TaskDashboard.jsx';
import awsExports from './amplify-config.js';
import './App.css';

// Configure Amplify
try {
  Amplify.configure(awsExports);
} catch (error) {
  console.error('Error configuring Amplify:', error);
}

export default function App() {
  return (
    <Authenticator
      signUpAttributes={['email']}
      loginMechanisms={['email']}
      components={{
        Header: () => (
          <div style={{ 
            textAlign: 'center', 
            padding: '32px 24px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            margin: '-24px -24px 24px -24px',
            borderRadius: '16px 16px 0 0',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
              pointerEvents: 'none'
            }} />
            <div style={{
              position: 'relative',
              zIndex: 1
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
              }}>
                <span style={{ fontSize: '28px' }}>✓</span>
              </div>
              <h2 style={{ 
                color: 'white', 
                margin: '0 0 8px 0',
                fontSize: '2rem',
                fontWeight: '700',
                letterSpacing: '-0.025em'
              }}>
                Welcome to TodoPro
              </h2>
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.9)', 
                margin: 0,
                fontSize: '1rem',
                fontWeight: '500'
              }}>
                Organize your tasks with clarity and focus
              </p>
            </div>
          </div>
        )
      }}
    >
      {({ signOut, user }) => {
        const userEmail = user?.attributes?.email || 
                         user?.signInDetails?.loginId || 
                         user?.username || 
                         'User';
        const displayName = userEmail.split('@')[0];

        return (
          <div style={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            position: 'relative'
          }}>
            {/* Decorative background elements */}
            <div style={{
              position: 'fixed',
              top: '-10%',
              right: '-5%',
              width: '500px',
              height: '500px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
              borderRadius: '50%',
              pointerEvents: 'none',
              zIndex: 0
            }} />
            <div style={{
              position: 'fixed',
              bottom: '-15%',
              left: '-10%',
              width: '600px',
              height: '600px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
              borderRadius: '50%',
              pointerEvents: 'none',
              zIndex: 0
            }} />

            <header style={{
              position: 'sticky',
              top: 0,
              zIndex: 50,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 32px',
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)'
            }}>
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
                  fontSize: '20px',
                  boxShadow: '0 4px 14px rgba(102, 126, 234, 0.3)'
                }}>
                  ✓
                </div>
                <div>
                  <h1 style={{
                    margin: 0,
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    letterSpacing: '-0.025em'
                  }}>
                    TodoPro
                  </h1>
                  <p style={{
                    margin: 0,
                    fontSize: '0.75rem',
                    color: '#9ca3af',
                    fontWeight: '500'
                  }}>
                    Task Management System
                  </p>
                </div>
              </div>
              
              {user && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 20px',
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
                    borderRadius: '12px',
                    border: '1px solid rgba(102, 126, 234, 0.2)'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      background: 'linear-gradient(135deg, #667eea, #764ba2)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      textTransform: 'uppercase'
                    }}>
                      {displayName.charAt(0)}
                    </div>
                    <div>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#374151'
                      }}>
                        {displayName}
                      </div>
                      <div style={{
                        fontSize: '0.7rem',
                        color: '#9ca3af',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <div style={{
                          width: '6px',
                          height: '6px',
                          backgroundColor: '#10b981',
                          borderRadius: '50%'
                        }} />
                        Online
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={signOut}
                    className="btn btn-outline"
                    style={{
                      padding: '10px 20px',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </header>
            
            <main style={{
              maxWidth: '1000px',
              margin: '0 auto',
              padding: '40px 24px',
              position: 'relative',
              zIndex: 1
            }}>
              <TaskDashboard />
            </main>
          </div>
        );
      }}
    </Authenticator>
  );
}