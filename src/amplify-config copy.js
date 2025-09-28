// src/amplify-config.js
export const ApiName = 'TodoApi'; 

const amplifyConfig = {
    aws_project_region: 'eu-west-1',
    aws_cognito_region: 'eu-west-1',
    aws_user_pools_id: 'eu-west-1_e64KfNLaj',
    aws_user_pools_web_client_id: '2q32k74sfsmh4f8prvu5r5rjjq', 
    aws_cognito_username_attributes: ['EMAIL'],
    aws_cognito_signup_attributes: ['EMAIL'],
    aws_cognito_password_protection_settings: {
        passwordPolicyMinLength: 8,
        passwordPolicyCharacters: []
    },
    aws_cognito_verification_mechanisms: ['EMAIL'],
    
    // Auth configuration
    Auth: {
        region: 'eu-west-1',
        userPoolId: 'eu-west-1_TEWzvQYNP',
        userPoolWebClientId: '2q32k74sfsmh4f8prvu5r5rjjq',
        authenticationFlowType: 'ADMIN_NO_SRP_AUTH',
        mandatorySignIn: true,
        identityPoolRegion: 'eu-west-1',
        // ADD DOMAIN CONFIGURATION HERE:
        oauth: {
            domain: 'todo-app-todo-backend.auth.eu-west-1.amazoncognito.com',
            scope: ['email', 'openid', 'profile'],
            redirectSignIn: 'http://localhost:5173',
            redirectSignOut: 'http://localhost:5173',
            responseType: 'code'
        }
    },
    
    // API configuration
    API: {
        // endpoints: [
        //     {
        //         name: 'TodoApi',
        //         endpoint: 'https://oapebwd3v5.execute-api.eu-west-1.amazonaws.com/Prod',
        //         region: 'eu-west-1'
        //     }
        // ]

        REST: {
            // The key here must match the exported ApiName constant
            [ApiName]: {
                // Endpoint must be the full ApiUrl output from your stack
                endpoint: 'https://oapebwd3v5.execute-api.eu-west-1.amazonaws.com/Prod', 
                // Region must be the Region output from your stack (e.g., 'eu-west-1')
                region: 'eu-west-1' 
            }
        }
    }
};

// export const ApiName = 'TodoApi';
export default amplifyConfig;