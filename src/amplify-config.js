// src/amplify-config.js
const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_USER_POOL_ID,
      userPoolClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID,
      identityPoolId: import.meta.env.VITE_IDENTITY_POOL_ID,
    }
  }
};

export default amplifyConfig;

// Use environment variable for API endpoint with fallback
export const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT 