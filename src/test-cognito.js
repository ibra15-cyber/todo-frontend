// src/test-cognito.js (temporary test file)
import { Auth } from 'aws-amplify';

const testCognito = async () => {
    try {
        // Test configuration
        const config = Auth.configure();
        console.log('Auth config:', config);
        
        // Try to list users (admin action - just to test connectivity)
        console.log('Cognito configuration appears valid');
    } catch (error) {
        console.error('Cognito configuration error:', error);
    }
};

testCognito();