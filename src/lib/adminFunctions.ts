import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

/**
 * Set up the initial admin user. This should only be used once to create the first admin.
 * 
 * @param uid - The user ID to make an admin
 * @param secretKey - The secret key for authorization
 * @returns A promise that resolves with the result
 */
export const setupInitialAdmin = async (uid: string, secretKey: string) => {
  try {
    const setupAdmin = httpsCallable(functions, 'setupInitialAdmin');
    const result = await setupAdmin({ uid, secretKey });
    return result.data;
  } catch (error: any) {
    console.error('Error setting up initial admin:', error);
    throw new Error(error.message || 'Failed to set up admin');
  }
};

/**
 * Set or remove admin claims for a user. Only existing admins can call this.
 * 
 * @param targetUid - The user ID to update
 * @param isAdmin - Whether to grant (true) or revoke (false) admin rights
 * @returns A promise that resolves with the result
 */
export const setAdminClaim = async (targetUid: string, isAdmin: boolean) => {
  try {
    const setAdmin = httpsCallable(functions, 'setAdminClaim');
    const result = await setAdmin({ targetUid, isAdmin });
    return result.data;
  } catch (error: any) {
    console.error('Error setting admin claim:', error);
    throw new Error(error.message || 'Failed to update admin status');
  }
};

/**
 * Check if the current user has admin privileges
 * 
 * @param user - The Firebase user object
 * @returns True if the user is an admin, false otherwise
 */
export const isUserAdmin = (user: any): boolean => {
  return user?.customClaims?.admin === true || user?.token?.claims?.admin === true;
}; 