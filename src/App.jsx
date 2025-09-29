// src/App.jsx
import React from 'react';
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import TaskDashboard from './TaskDashboard.jsx';
import awsExports from './amplify-config.js';

// Add error handling for Amplify configuration
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
        >
            {({ signOut, user }) => {

                // Extract email safely
                const userEmail = user?.attributes?.email ||
                    user?.signInDetails?.loginId ||UpdateTaskForm
                    user?.username ||
                    'User';

                return (
                    <div className="App">
                        <header className="App-header" style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '10px 20px',
                            backgroundColor: '#333',
                            color: 'white'
                        }}>
                            <h1>To-Do App</h1>
                            {user && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <span>Welcome, {userEmail}</span>
                                    <button
                                        onClick={signOut}
                                        style={{
                                            background: '#ff4444',
                                            border: 'none',
                                            color: 'white',
                                            cursor: 'pointer',
                                            padding: '8px 15px',
                                            borderRadius: '4px'
                                        }}
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </header>
                        <main style={{ padding: '20px' }}>
                            <TaskDashboard />
                        </main>
                    </div>
                );
            }}
        </Authenticator>
    );
}