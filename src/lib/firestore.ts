import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit as firestoreLimit, 
  Timestamp, 
  serverTimestamp,
  DocumentReference,
  QueryConstraint,
  onSnapshot,
  increment,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';

// ============================
// SCHEMA TYPES
// ============================

export type User = {
  uid: string;
  phoneNumber: string | null;
  displayName?: string;
  email?: string;
  profilePicture?: string;
  createdAt: Timestamp;
  lastLogin: Timestamp;
  isActive: boolean;
  referralCode?: string;
  referredBy?: string;
  totalEarnings?: number;
  completedTasks?: number;
  dailyStreak?: number;
  lastStreakUpdate?: Timestamp;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'survey' | 'follow' | 'subscribe' | 'app' | 'other';
  platform?: 'youtube' | 'instagram' | 'tiktok' | 'survey' | 'website' | 'app';
  reward: number;
  url: string;
  timeEstimate: string;
  createdAt: Timestamp;
  expiresAt?: Timestamp;
  isActive: boolean;
  dailyLimit?: number;
  totalLimit?: number;
  completedCount?: number;
  category?: string;
  tags?: string[];
};

export type Wallet = {
  userId: string;
  balance: number;
  totalEarned: number;
  totalWithdrawn: number;
  pendingWithdrawal: number;
  lastUpdated: Timestamp;
  withdrawalThreshold: number;
};

export type Referral = {
  id: string;
  referrerId: string;
  referreeId: string;
  referreePhone: string;
  status: 'pending' | 'completed' | 'rewarded';
  createdAt: Timestamp;
  completedAt?: Timestamp;
  rewardAmount: number;
  rewardPaid: boolean;
};

export type Transaction = {
  id: string;
  userId: string;
  type: 'earning' | 'withdrawal' | 'referral' | 'bonus';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  relatedTaskId?: string;
  relatedReferralId?: string;
  paymentMethod?: string;
  paymentDetails?: Record<string, any>;
};

export type TaskCompletion = {
  id: string;
  userId: string;
  taskId: string;
  completedAt: Timestamp;
  reward: number;
  status: 'pending' | 'verified' | 'rejected';
  proofData?: Record<string, any>;
  verifiedAt?: Timestamp;
};

// Add this new type for user tasks
export type UserTask = {
  id?: string;
  userId: string;
  taskId: string;
  status: 'pending' | 'completed' | 'rejected';
  submittedAt: Timestamp;
  completedAt?: Timestamp;
  proofData?: Record<string, any>;
};

// ============================
// USER FUNCTIONS
// ============================

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) return null;
    return userDoc.data() as User;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

export const updateUserProfile = async (userId: string, data: Partial<User>): Promise<boolean> => {
  try {
    await updateDoc(doc(db, 'users', userId), {
      ...data,
      lastUpdated: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating user:', error);
    return false;
  }
};

export const generateReferralCode = async (userId: string): Promise<string | null> => {
  try {
    // Generate a unique 6-character code based on userId and random chars
    const randomChars = Math.random().toString(36).substring(2, 5).toUpperCase();
    const userSuffix = userId.substring(0, 3).toUpperCase();
    const referralCode = `${randomChars}${userSuffix}`;
    
    // Save to user profile
    await updateDoc(doc(db, 'users', userId), {
      referralCode,
      lastUpdated: serverTimestamp()
    });
    
    return referralCode;
  } catch (error) {
    console.error('Error generating referral code:', error);
    return null;
  }
};

export const updateUserStreak = async (userId: string): Promise<number> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) return 0;
    
    const userData = userDoc.data() as User;
    const lastUpdate = userData.lastStreakUpdate?.toDate() || new Date(0);
    const today = new Date();
    
    // Reset date parts to compare just the dates
    lastUpdate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    let newStreak = userData.dailyStreak || 0;
    const oneDayMs = 24 * 60 * 60 * 1000;
    const dayDiff = Math.round((today.getTime() - lastUpdate.getTime()) / oneDayMs);
    
    if (dayDiff === 1) {
      // Consecutive day, increment streak
      newStreak += 1;
    } else if (dayDiff > 1) {
      // Streak broken
      newStreak = 1;
    } else if (dayDiff === 0) {
      // Already updated today
      return newStreak;
    }
    
    await updateDoc(doc(db, 'users', userId), {
      dailyStreak: newStreak,
      lastStreakUpdate: serverTimestamp()
    });
    
    return newStreak;
  } catch (error) {
    console.error('Error updating streak:', error);
    return 0;
  }
};

// ============================
// TASK FUNCTIONS
// ============================

export const getAvailableTasks = async (
  category?: string, 
  platform?: string, 
  limitCount?: number
): Promise<Task[]> => {
  try {
    const constraints: QueryConstraint[] = [
      where('isActive', '==', true),
      orderBy('createdAt', 'desc')
    ];
    
    if (category) {
      constraints.push(where('category', '==', category));
    }
    
    if (platform) {
      constraints.push(where('platform', '==', platform));
    }
    
    if (limitCount) {
      constraints.push(firestoreLimit(limitCount));
    }
    
    const q = query(collection(db, 'tasks'), ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as Task));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
};

export const getTaskById = async (taskId: string): Promise<Task | null> => {
  try {
    const taskDoc = await getDoc(doc(db, 'tasks', taskId));
    if (!taskDoc.exists()) return null;
    return { id: taskDoc.id, ...taskDoc.data() } as Task;
  } catch (error) {
    console.error('Error fetching task:', error);
    return null;
  }
};

export const completeTask = async (
  userId: string, 
  taskId: string, 
  proofData?: Record<string, any>
): Promise<boolean> => {
  try {
    const batch = writeBatch(db);
    
    // Get task details
    const taskDoc = await getDoc(doc(db, 'tasks', taskId));
    if (!taskDoc.exists()) return false;
    const taskData = taskDoc.data() as Task;
    
    // Create task completion record
    const completionRef = doc(collection(db, 'taskCompletions'));
    batch.set(completionRef, {
      userId,
      taskId,
      completedAt: serverTimestamp(),
      reward: taskData.reward,
      status: 'verified', // Auto-verify for now
      proofData: proofData || {},
      verifiedAt: serverTimestamp()
    } as TaskCompletion);
    
    // Update task completion count
    batch.update(doc(db, 'tasks', taskId), {
      completedCount: increment(1)
    });
    
    // Update user's wallet
    const walletRef = doc(db, 'wallets', userId);
    const walletDoc = await getDoc(walletRef);
    
    if (walletDoc.exists()) {
      batch.update(walletRef, {
        balance: increment(taskData.reward),
        totalEarned: increment(taskData.reward),
        lastUpdated: serverTimestamp()
      });
    } else {
      batch.set(walletRef, {
        userId,
        balance: taskData.reward,
        totalEarned: taskData.reward,
        totalWithdrawn: 0,
        pendingWithdrawal: 0,
        lastUpdated: serverTimestamp(),
        withdrawalThreshold: 200 // Default
      } as Wallet);
    }
    
    // Create transaction record
    const transactionRef = doc(collection(db, 'transactions'));
    batch.set(transactionRef, {
      userId,
      type: 'earning',
      amount: taskData.reward,
      description: `Completed task: ${taskData.title}`,
      status: 'completed',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      relatedTaskId: taskId
    } as Transaction);
    
    // Update user's stats
    batch.update(doc(db, 'users', userId), {
      completedTasks: increment(1),
      totalEarnings: increment(taskData.reward)
    });
    
    // Commit all changes
    await batch.commit();
    return true;
  } catch (error) {
    console.error('Error completing task:', error);
    return false;
  }
};

// ============================
// WALLET FUNCTIONS
// ============================

export const getWallet = async (userId: string): Promise<Wallet | null> => {
  try {
    const walletDoc = await getDoc(doc(db, 'wallets', userId));
    if (!walletDoc.exists()) {
      // Create a new wallet if it doesn't exist
      const newWallet: Wallet = {
        userId,
        balance: 0,
        totalEarned: 0,
        totalWithdrawn: 0,
        pendingWithdrawal: 0,
        lastUpdated: Timestamp.now(),
        withdrawalThreshold: 200 // Default
      };
      await setDoc(doc(db, 'wallets', userId), newWallet);
      return newWallet;
    }
    return walletDoc.data() as Wallet;
  } catch (error) {
    console.error('Error fetching wallet:', error);
    return null;
  }
};

export const requestWithdrawal = async (
  userId: string, 
  amount: number, 
  paymentMethod: string, 
  paymentDetails: Record<string, any>
): Promise<boolean> => {
  try {
    const walletRef = doc(db, 'wallets', userId);
    const walletDoc = await getDoc(walletRef);
    
    if (!walletDoc.exists()) return false;
    
    const wallet = walletDoc.data() as Wallet;
    
    // Check if balance is sufficient
    if (wallet.balance < amount) return false;
    
    // Check if amount meets threshold
    if (amount < wallet.withdrawalThreshold) return false;
    
    const batch = writeBatch(db);
    
    // Update wallet
    batch.update(walletRef, {
      balance: increment(-amount),
      pendingWithdrawal: increment(amount),
      lastUpdated: serverTimestamp()
    });
    
    // Create transaction record
    const transactionRef = doc(collection(db, 'transactions'));
    batch.set(transactionRef, {
      userId,
      type: 'withdrawal',
      amount: amount,
      description: `Withdrawal via ${paymentMethod}`,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      paymentMethod,
      paymentDetails
    } as Transaction);
    
    await batch.commit();
    return true;
  } catch (error) {
    console.error('Error requesting withdrawal:', error);
    return false;
  }
};

export const completeWithdrawal = async (transactionId: string): Promise<boolean> => {
  try {
    const transactionRef = doc(db, 'transactions', transactionId);
    const transactionDoc = await getDoc(transactionRef);
    
    if (!transactionDoc.exists()) return false;
    
    const transaction = transactionDoc.data() as Transaction;
    if (transaction.type !== 'withdrawal' || transaction.status !== 'pending') {
      return false;
    }
    
    const batch = writeBatch(db);
    
    // Update transaction
    batch.update(transactionRef, {
      status: 'completed',
      updatedAt: serverTimestamp()
    });
    
    // Update wallet
    const walletRef = doc(db, 'wallets', transaction.userId);
    batch.update(walletRef, {
      pendingWithdrawal: increment(-transaction.amount),
      totalWithdrawn: increment(transaction.amount),
      lastUpdated: serverTimestamp()
    });
    
    await batch.commit();
    return true;
  } catch (error) {
    console.error('Error completing withdrawal:', error);
    return false;
  }
};

// ============================
// REFERRAL FUNCTIONS
// ============================

export const createReferral = async (
  referrerId: string, 
  referreePhone: string
): Promise<string | null> => {
  try {
    // Check if referral already exists
    const q = query(
      collection(db, 'referrals'),
      where('referrerId', '==', referrerId),
      where('referreePhone', '==', referreePhone)
    );
    
    const existingRefs = await getDocs(q);
    if (!existingRefs.empty) {
      return null; // Referral already exists
    }
    
    // Create new referral
    const referralData: Omit<Referral, 'id'> = {
      referrerId,
      referreeId: '', // Will be populated when user registers
      referreePhone,
      status: 'pending',
      createdAt: Timestamp.now(),
      rewardAmount: 5, // Default reward amount
      rewardPaid: false
    };
    
    const referralRef = await addDoc(collection(db, 'referrals'), referralData);
    return referralRef.id;
  } catch (error) {
    console.error('Error creating referral:', error);
    return null;
  }
};

export const completeReferral = async (
  referralId: string, 
  referreeId: string
): Promise<boolean> => {
  try {
    const referralRef = doc(db, 'referrals', referralId);
    const referralDoc = await getDoc(referralRef);
    
    if (!referralDoc.exists()) return false;
    
    const referral = referralDoc.data() as Referral;
    if (referral.status !== 'pending') return false;
    
    const batch = writeBatch(db);
    
    // Update referral
    batch.update(referralRef, {
      referreeId,
      status: 'completed',
      completedAt: serverTimestamp()
    });
    
    // Update referrer's user record
    const userRef = doc(db, 'users', referral.referrerId);
    await updateDoc(userRef, {
      'referredCount': increment(1)
    });
    
    await batch.commit();
    return true;
  } catch (error) {
    console.error('Error completing referral:', error);
    return false;
  }
};

export const rewardReferral = async (referralId: string): Promise<boolean> => {
  try {
    const referralRef = doc(db, 'referrals', referralId);
    const referralDoc = await getDoc(referralRef);
    
    if (!referralDoc.exists()) return false;
    
    const referral = referralDoc.data() as Referral;
    if (referral.status !== 'completed' || referral.rewardPaid) return false;
    
    const batch = writeBatch(db);
    
    // Update referral status
    batch.update(referralRef, {
      status: 'rewarded',
      rewardPaid: true
    });
    
    // Add reward to referrer's wallet
    const walletRef = doc(db, 'wallets', referral.referrerId);
    const walletDoc = await getDoc(walletRef);
    
    if (walletDoc.exists()) {
      batch.update(walletRef, {
        balance: increment(referral.rewardAmount),
        totalEarned: increment(referral.rewardAmount),
        lastUpdated: serverTimestamp()
      });
    } else {
      batch.set(walletRef, {
        userId: referral.referrerId,
        balance: referral.rewardAmount,
        totalEarned: referral.rewardAmount,
        totalWithdrawn: 0,
        pendingWithdrawal: 0,
        lastUpdated: serverTimestamp(),
        withdrawalThreshold: 200
      } as Wallet);
    }
    
    // Create transaction record
    const transactionRef = doc(collection(db, 'transactions'));
    batch.set(transactionRef, {
      userId: referral.referrerId,
      type: 'referral',
      amount: referral.rewardAmount,
      description: `Referral reward for inviting a friend`,
      status: 'completed',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      relatedReferralId: referralId
    } as Transaction);
    
    // Update user's total earnings
    batch.update(doc(db, 'users', referral.referrerId), {
      totalEarnings: increment(referral.rewardAmount)
    });
    
    await batch.commit();
    return true;
  } catch (error) {
    console.error('Error rewarding referral:', error);
    return false;
  }
};

// ============================
// TRANSACTION FUNCTIONS
// ============================

export const getUserTransactions = async (
  userId: string, 
  type?: Transaction['type'],
  limitCount = 10
): Promise<Transaction[]> => {
  try {
    const constraints: QueryConstraint[] = [
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    ];
    
    if (type) {
      constraints.push(where('type', '==', type));
    }
    
    constraints.push(firestoreLimit(limitCount));
    
    const q = query(collection(db, 'transactions'), ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as Transaction));
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
};

// ============================
// REAL-TIME SUBSCRIPTIONS
// ============================

export const subscribeToWallet = (
  userId: string, 
  callback: (wallet: Wallet) => void
): (() => void) => {
  const walletRef = doc(db, 'wallets', userId);
  
  return onSnapshot(walletRef, (doc) => {
    if (doc.exists()) {
      callback(doc.data() as Wallet);
    }
  }, (error) => {
    console.error('Error subscribing to wallet:', error);
  });
};

export const subscribeToUserTransactions = (
  userId: string, 
  callback: (transactions: Transaction[]) => void
): (() => void) => {
  const q = query(
    collection(db, 'transactions'), 
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    firestoreLimit(10)
  );
  
  return onSnapshot(q, (querySnapshot) => {
    const transactions = querySnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    } as Transaction));
    
    callback(transactions);
  }, (error) => {
    console.error('Error subscribing to transactions:', error);
  });
};

// Add these new functions for user tasks

export const checkUserTaskExists = async (userId: string, taskId: string): Promise<boolean> => {
  try {
    const q = query(
      collection(db, 'userTasks'),
      where('userId', '==', userId),
      where('taskId', '==', taskId)
    );
    
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking user task:', error);
    return false;
  }
};

export const createUserTaskSubmission = async (
  userId: string, 
  taskId: string, 
  proofData?: Record<string, any>
): Promise<string | null> => {
  try {
    // Check if task submission already exists
    const taskExists = await checkUserTaskExists(userId, taskId);
    
    if (taskExists) {
      console.warn('User has already submitted this task');
      return null;
    }
    
    // Create new task submission
    const userTaskData: UserTask = {
      userId,
      taskId,
      status: 'pending',
      submittedAt: serverTimestamp() as Timestamp,
      proofData: proofData || {}
    };
    
    const userTaskRef = await addDoc(collection(db, 'userTasks'), userTaskData);
    return userTaskRef.id;
  } catch (error) {
    console.error('Error creating user task submission:', error);
    return null;
  }
}; 