# EarnIt Admin Setup Guide

This guide will help you deploy Firestore security rules and set up admin users.

## Deploying Firestore Rules and Functions

1. **Deploy Firestore Rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```

2. **Deploy Firestore Indexes**:
   ```bash
   firebase deploy --only firestore:indexes
   ```

3. **Deploy Cloud Functions**:
   ```bash
   firebase deploy --only functions
   ```

## Setting Up Admin Users

### Create the First Admin

To set up the first admin user, follow these steps:

1. **Update the Secret Key in Functions**:
   - Set an environment variable for your Firebase Functions:
   ```bash
   firebase functions:config:set admin.setup_secret="YOUR_SECURE_SECRET_KEY"
   ```
   - Or set it directly in the code (less secure, for testing only).

2. **Run the Setup Initial Admin Function**:
   You can call this function from a browser console (only when logged in as the user you want to make an admin):

   ```javascript
   // Replace these values
   const uid = "YOUR_USER_ID"; // The user ID you want to make an admin
   const secretKey = "YOUR_SECURE_SECRET_KEY"; // Same secret key from step 1

   // Import the functions
   import { setupInitialAdmin } from './src/lib/adminFunctions';

   // Call the setup function
   setupInitialAdmin(uid, secretKey)
     .then(result => console.log(result))
     .catch(error => console.error(error));
   ```

3. **Log Out and Log Back In**:
   The user needs to log out and log back in for the admin claims to take effect.

### Adding More Admins

Once you have the first admin set up, you can use the `setAdminClaim` function to add more admins:

```javascript
// This must be called by an existing admin user
import { setAdminClaim } from './src/lib/adminFunctions';

// Make another user an admin
setAdminClaim('NEW_USER_ID', true)
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

## Checking Admin Status

To check if a user has admin privileges:

```javascript
import { isUserAdmin } from './src/lib/adminFunctions';

// Get the current user from your authentication context
const { user } = useAuth();

// Check if the user is an admin
const admin = isUserAdmin(user);
console.log('Is admin:', admin);
```

## Security Notes

1. **Protection of Wallets**: Users can only read their own wallet data, but only admins or Cloud Functions can update wallet balances.

2. **Admin Access**: Only existing admins can create new admins.

3. **User Data**: Users can update their own profile data but cannot modify sensitive fields like balance or admin status.

4. **Tasks**: All users can view available tasks, but only admins can create or update tasks.

## Firestore Rules Overview

The deployed security rules provide these permissions:

- **Wallets**: Users can read their own wallet, but cannot modify it
- **Users**: Users can read and update their own profile (except sensitive fields)
- **Tasks**: All authenticated users can read tasks, only admins can write
- **UserTasks**: Users can create and read their own task submissions
- **Transactions**: Users can read their own transactions
- **Referrals**: Users can view and create referrals

## Troubleshooting

- **Admin Claims Not Working**: Remember that the user needs to log out and log back in for custom claims to take effect.
- **Permission Denied**: Check the Firestore rules and make sure the user has the necessary permissions.
- **Function Errors**: Check the Firebase Functions logs for detailed error messages. 