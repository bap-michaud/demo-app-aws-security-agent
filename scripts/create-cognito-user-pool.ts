import {
  CognitoIdentityProviderClient,
  CreateUserPoolCommand,
  CreateUserPoolClientCommand,
  CreateGroupCommand,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  AdminAddUserToGroupCommand,
  DescribeUserPoolCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const client = new CognitoIdentityProviderClient({
  region: process.env.COGNITO_REGION || process.env.AWS_REGION || 'us-east-1',
  credentials:
    process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
      ? {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        }
      : undefined,
});

async function createUserPool() {
  try {
    console.log('Creating Cognito User Pool...');

    // Create User Pool
    const createPoolCommand = new CreateUserPoolCommand({
      PoolName: 'citation-app-users',
      Policies: {
        PasswordPolicy: {
          MinimumLength: 8,
          RequireUppercase: true,
          RequireLowercase: true,
          RequireNumbers: true,
          RequireSymbols: true,
          TemporaryPasswordValidityDays: 7,
        },
      },
      AutoVerifiedAttributes: ['email'],
      UsernameAttributes: ['email'],
      UsernameConfiguration: {
        CaseSensitive: false,
      },
      Schema: [
        {
          Name: 'email',
          AttributeDataType: 'String',
          Required: true,
          Mutable: true,
        },
        {
          Name: 'name',
          AttributeDataType: 'String',
          Required: false,
          Mutable: true,
        },
        {
          Name: 'role',
          AttributeDataType: 'String',
          Required: false,
          Mutable: true,
          StringAttributeConstraints: {
            MinLength: '1',
            MaxLength: '256',
          },
        },
      ],
      MfaConfiguration: 'OPTIONAL',
      AccountRecoverySetting: {
        RecoveryMechanisms: [
          {
            Priority: 1,
            Name: 'verified_email',
          },
        ],
      },
    });

    const poolResponse = await client.send(createPoolCommand);
    const userPoolId = poolResponse.UserPool?.Id;

    if (!userPoolId) {
      throw new Error('Failed to create user pool');
    }

    console.log(`User Pool created: ${userPoolId}`);

    // Create User Pool Client
    const createClientCommand = new CreateUserPoolClientCommand({
      UserPoolId: userPoolId,
      ClientName: 'citation-app-client',
      GenerateSecret: false,
      ExplicitAuthFlows: [
        'ALLOW_USER_PASSWORD_AUTH',
        'ALLOW_REFRESH_TOKEN_AUTH',
        'ALLOW_USER_SRP_AUTH',
      ],
      PreventUserExistenceErrors: 'ENABLED',
      RefreshTokenValidity: 30,
      AccessTokenValidity: 60,
      IdTokenValidity: 60,
      TokenValidityUnits: {
        RefreshToken: 'days',
        AccessToken: 'minutes',
        IdToken: 'minutes',
      },
    });

    const clientResponse = await client.send(createClientCommand);
    const clientId = clientResponse.UserPoolClient?.ClientId;

    if (!clientId) {
      throw new Error('Failed to create user pool client');
    }

    console.log(`User Pool Client created: ${clientId}`);

    // Create Admin Group
    const createAdminGroupCommand = new CreateGroupCommand({
      GroupName: 'Admins',
      UserPoolId: userPoolId,
      Description: 'Administrator users with full access',
      Precedence: 1,
    });

    await client.send(createAdminGroupCommand);
    console.log('Admin group created');

    // Create Users Group
    const createUsersGroupCommand = new CreateGroupCommand({
      GroupName: 'Users',
      UserPoolId: userPoolId,
      Description: 'Regular users with standard access',
      Precedence: 2,
    });

    await client.send(createUsersGroupCommand);
    console.log('Users group created');

    // Create test admin user
    const createAdminCommand = new AdminCreateUserCommand({
      UserPoolId: userPoolId,
      Username: 'admin@example.com',
      UserAttributes: [
        { Name: 'email', Value: 'admin@example.com' },
        { Name: 'email_verified', Value: 'true' },
        { Name: 'name', Value: 'Admin User' },
        { Name: 'custom:role', Value: 'ADMIN' },
      ],
      TemporaryPassword: 'TempPass123!',
      MessageAction: 'SUPPRESS',
    });

    await client.send(createAdminCommand);
    console.log('Test admin user created: admin@example.com');

    // Set permanent password for admin
    const setAdminPasswordCommand = new AdminSetUserPasswordCommand({
      UserPoolId: userPoolId,
      Username: 'admin@example.com',
      Password: 'AdminPass123!',
      Permanent: true,
    });

    await client.send(setAdminPasswordCommand);
    console.log('Admin password set to: AdminPass123!');

    // Add admin to Admins group
    const addAdminToGroupCommand = new AdminAddUserToGroupCommand({
      UserPoolId: userPoolId,
      Username: 'admin@example.com',
      GroupName: 'Admins',
    });

    await client.send(addAdminToGroupCommand);
    console.log('Admin user added to Admins group');

    // Create test regular user
    const createUserCommand = new AdminCreateUserCommand({
      UserPoolId: userPoolId,
      Username: 'user@example.com',
      UserAttributes: [
        { Name: 'email', Value: 'user@example.com' },
        { Name: 'email_verified', Value: 'true' },
        { Name: 'name', Value: 'Regular User' },
        { Name: 'custom:role', Value: 'USER' },
      ],
      TemporaryPassword: 'TempPass123!',
      MessageAction: 'SUPPRESS',
    });

    await client.send(createUserCommand);
    console.log('Test regular user created: user@example.com');

    // Set permanent password for user
    const setUserPasswordCommand = new AdminSetUserPasswordCommand({
      UserPoolId: userPoolId,
      Username: 'user@example.com',
      Password: 'UserPass123!',
      Permanent: true,
    });

    await client.send(setUserPasswordCommand);
    console.log('User password set to: UserPass123!');

    // Add user to Users group
    const addUserToGroupCommand = new AdminAddUserToGroupCommand({
      UserPoolId: userPoolId,
      Username: 'user@example.com',
      GroupName: 'Users',
    });

    await client.send(addUserToGroupCommand);
    console.log('Regular user added to Users group');

    console.log('\n=== Configuration Summary ===');
    console.log(`User Pool ID: ${userPoolId}`);
    console.log(`Client ID: ${clientId}`);
    console.log('\nTest Users:');
    console.log('Admin: admin@example.com / AdminPass123!');
    console.log('User: user@example.com / UserPass123!');
    console.log('\nUpdate your .env.local with:');
    console.log(`COGNITO_USER_POOL_ID=${userPoolId}`);
    console.log(`COGNITO_CLIENT_ID=${clientId}`);

    return { userPoolId, clientId };
  } catch (error: any) {
    if (error.name === 'UsernameExistsException') {
      console.log('User pool or users may already exist');
    } else {
      console.error('Error creating user pool:', error);
      throw error;
    }
  }
}

createUserPool()
  .then(() => {
    console.log('\nCognito User Pool setup complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to create Cognito User Pool:', error);
    process.exit(1);
  });
