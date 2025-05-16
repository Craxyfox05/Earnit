import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

/**
 * Calls the verifyTaskCompletion cloud function to verify a task and reward the user
 * 
 * @param userId - The ID of the user who completed the task
 * @param taskId - The ID of the task to verify
 * @returns A promise that resolves with the result of the verification
 */
export const verifyTaskCompletion = async (userId: string, taskId: string) => {
  try {
    // Get a reference to the cloud function
    const verifyTaskFn = httpsCallable(functions, 'verifyTaskCompletion');
    
    // Call the function with the provided parameters
    const result = await verifyTaskFn({ userId, taskId });
    
    return result.data;
  } catch (error: any) {
    console.error('Error verifying task completion:', error);
    throw new Error(error.message || 'Failed to verify task completion');
  }
}; 