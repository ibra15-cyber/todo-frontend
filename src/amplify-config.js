// src/amplify-config.js
const amplifyConfig = {
    Auth: {
        Cognito: {
            userPoolId: 'eu-west-1_ChvVUBEdk',
            userPoolClientId: '6a1s7p2mu4bchunanqilpson3l',
            identityPoolId: 'eu-west-1:57a5e16a-8d11-4ff1-b75f-b670663b80d6',
        }
    }
};

export default amplifyConfig;

// Remove the ApiName export and use the endpoint directly
export const API_ENDPOINT = 'https://ck5qu0275c.execute-api.eu-west-1.amazonaws.com/Prod';