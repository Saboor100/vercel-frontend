import { ref, set, get, push, remove, update, query, orderByChild, equalTo } from 'firebase/database';
import { realtimeDb, auth } from './firebase';
import { ResumeData, CoverLetterData } from '@/types/documents';
import { aiService } from './aiService';
import Stripe from 'stripe';
import { SubscriptionData } from '@/hooks/useFirebaseAuth';
// User service for Firebase Realtime Database
export const userService = {
  // Update user profile
 

  updateProfile: async (profileData: { displayName: string; subscriptionData: SubscriptionData; stripeCustomerId?: string }) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, message: 'User not authenticated' };
      }
  
      const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY, {
        apiVersion: '2025-03-31.basil',
      });
  
      let subscriptionData: SubscriptionData = profileData.subscriptionData;
  
      // If stripeCustomerId exists, update subscription data by checking Stripe
      if (profileData.stripeCustomerId) {
        const subscriptions = await stripe.subscriptions.list({
          customer: profileData.stripeCustomerId,
          status: 'active',
          limit: 1,
        });
  
        if (subscriptions.data.length > 0) {
          const sub = subscriptions.data[0];
          const price = sub.items.data[0]?.price;
  
          // Always use the product's name as the subscription name
          if (price && price.product) {
            const product = await stripe.products.retrieve(price.product as string);
            subscriptionData = {
              id: sub.id,
              status: sub.status,
              plan: product.name || price.id,
              cancel_at_period_end: sub.cancel_at_period_end,
            };
  
            // Update subscription data directly on Stripe
            await stripe.subscriptions.update(sub.id, {
              items: [
                {
                  id: sub.items.data[0].id,
                  price: price.id, // Use the correct price ID from the current plan
                },
              ],
            });
          }
        }
      }
  
      // Prepare the updated profile data, including stripeCustomerId
      const updatedProfile = {
        displayName: profileData.displayName,
        subscription: subscriptionData, // Full subscription data
        email: user.email,
        uid: user.uid,
        stripeCustomerId: profileData.stripeCustomerId, // Include the stripeCustomerId in the profile
        updatedAt: new Date().toISOString(),
      };
  
      // Store the updated profile in Firebase Realtime Database
      await set(ref(realtimeDb, `users/${user.uid}`), updatedProfile);
  
      return {
        success: true,
        data: updatedProfile,
      };
    } catch (error) {
      console.error('Error updating profile:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  },
  
  
  
  
  // Get user profile
  getProfile: async () => {
    try {
      const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY, {
        apiVersion: '2025-03-31.basil',
      });
      const user = auth.currentUser;
      if (!user) {
        return { success: false, message: 'User not authenticated' };
      }
  
      const snapshot = await get(ref(realtimeDb, `users/${user.uid}`));
      const profileData = snapshot.val();
  
      if (!profileData) {
        return { success: false, message: 'Profile not found' };
      }
  
      let subscriptionData = null;
      console.log("profileData", profileData);
  
      // Fetch subscription from Stripe if customer ID exists
      if (profileData.stripeCustomerId) {
        const subscriptions = await stripe.subscriptions.list({
          customer: profileData.stripeCustomerId,
          status: 'active',
          limit: 1,
        });
        console.log("profileData.stripeCustomerId",profileData.stripeCustomerId);
        
        console.log("subscriptions", subscriptions);
  
        if (subscriptions.data.length > 0) {
          const sub = subscriptions.data[0];
          const price = sub.items.data[0]?.price;
          const product = await stripe.products.retrieve(price.product as string);
  
          // Set subscriptionData based on status
          subscriptionData = {
            id: sub.id,
            status: sub.status,
            plan: sub.status === 'canceled' ? 'free' : product.name,  // If canceled, set plan to 'free'
            cancel_at_period_end: sub.cancel_at_period_end,
          };
        }
      }
  
      console.log("subscriptionData", subscriptionData);
  
      return {
        success: true,
        data: {
          ...profileData,
          uid: user.uid,
          email: user.email,
          subscription: subscriptionData,
        },
      };
    } catch (error) {
      console.error('Error getting profile:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  }
};

// Resume service for Firebase Realtime Database
export const resumeService = {
  // Create a new resume
  create: async (resumeData: ResumeData) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, message: 'User not authenticated' };
      }
      
      const newResumeRef = push(ref(realtimeDb, 'resumes'));
      
      const resumeWithMetadata = {
        ...resumeData,
        userId: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await set(newResumeRef, resumeWithMetadata);
      
      return {
        success: true,
        data: {
          id: newResumeRef.key,
          ...resumeWithMetadata
        }
      };
    } catch (error) {
      console.error('Error creating resume:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  },
  
  // Get a resume by ID
  getById: async (resumeId: string) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, message: 'User not authenticated' };
      }
      
      const snapshot = await get(ref(realtimeDb, `resumes/${resumeId}`));
      const resumeData = snapshot.val();
      
      if (!resumeData) {
        return { success: false, message: 'Resume not found' };
      }
      
      if (resumeData.userId !== user.uid) {
        return { success: false, message: 'Not authorized to access this resume' };
      }
      
      return {
        success: true,
        data: {
          id: resumeId,
          ...resumeData
        }
      };
    } catch (error) {
      console.error('Error getting resume:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  },
  
  // Get all resumes for the current user
  getAll: async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, message: 'User not authenticated', data: [] };
      }
      
      const resumesRef = ref(realtimeDb, 'resumes');
      const userResumesQuery = query(resumesRef, orderByChild('userId'), equalTo(user.uid));
      const snapshot = await get(userResumesQuery);
      const resumes = snapshot.val();
      
      if (!resumes) {
        return { success: true, data: [] };
      }
      
      const resumesList = Object.keys(resumes).map(key => ({
        id: key,
        ...resumes[key]
      }));
      
      return { success: true, data: resumesList };
    } catch (error) {
      console.error('Error getting resumes:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'An unknown error occurred',
        data: []
      };
    }
  },
  
  // Update a resume
  update: async (resumeId: string, resumeData: Partial<ResumeData>) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, message: 'User not authenticated' };
      }
      
      // Check if resume exists and belongs to user
      const currentSnapshot = await get(ref(realtimeDb, `resumes/${resumeId}`));
      const currentResume = currentSnapshot.val();
      
      if (!currentResume) {
        return { success: false, message: 'Resume not found' };
      }
      
      if (currentResume.userId !== user.uid) {
        return { success: false, message: 'Not authorized to update this resume' };
      }
      
      const updatedResume = {
        ...resumeData,
        updatedAt: new Date().toISOString()
      };
      
      await update(ref(realtimeDb, `resumes/${resumeId}`), updatedResume);
      
      return {
        success: true,
        data: {
          id: resumeId,
          ...currentResume,
          ...updatedResume
        }
      };
    } catch (error) {
      console.error('Error updating resume:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  },
  
  // Delete a resume
  delete: async (resumeId: string) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, message: 'User not authenticated' };
      }
      
      // Check if resume exists and belongs to user
      const snapshot = await get(ref(realtimeDb, `resumes/${resumeId}`));
      const resumeData = snapshot.val();
      
      if (!resumeData) {
        return { success: false, message: 'Resume not found' };
      }
      
      if (resumeData.userId !== user.uid) {
        return { success: false, message: 'Not authorized to delete this resume' };
      }
      
      await remove(ref(realtimeDb, `resumes/${resumeId}`));
      
      return { success: true, message: 'Resume deleted successfully' };
    } catch (error) {
      console.error('Error deleting resume:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  }
};

// Cover Letter service for Firebase Realtime Database
export const coverLetterService = {
  // Create a new cover letter
  create: async (coverLetterData: CoverLetterData) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, message: 'User not authenticated' };
      }
      
      const newCoverLetterRef = push(ref(realtimeDb, 'coverLetters'));
      
      const coverLetterWithMetadata = {
        ...coverLetterData,
        userId: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await set(newCoverLetterRef, coverLetterWithMetadata);
      
      return {
        success: true,
        data: {
          id: newCoverLetterRef.key,
          ...coverLetterWithMetadata
        }
      };
    } catch (error) {
      console.error('Error creating cover letter:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  },
  
  // Get a cover letter by ID
  getById: async (coverLetterId: string) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, message: 'User not authenticated' };
      }
      
      const snapshot = await get(ref(realtimeDb, `coverLetters/${coverLetterId}`));
      const coverLetterData = snapshot.val();
      
      if (!coverLetterData) {
        return { success: false, message: 'Cover letter not found' };
      }
      
      if (coverLetterData.userId !== user.uid) {
        return { success: false, message: 'Not authorized to access this cover letter' };
      }
      
      return {
        success: true,
        data: {
          id: coverLetterId,
          ...coverLetterData
        }
      };
    } catch (error) {
      console.error('Error getting cover letter:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  },
  
  // Get all cover letters for the current user
  getAll: async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, message: 'User not authenticated', data: [] };
      }
      
      const coverLettersRef = ref(realtimeDb, 'coverLetters');
      const userCoverLettersQuery = query(coverLettersRef, orderByChild('userId'), equalTo(user.uid));
      const snapshot = await get(userCoverLettersQuery);
      const coverLetters = snapshot.val();
      
      if (!coverLetters) {
        return { success: true, data: [] };
      }
      
      const coverLettersList = Object.keys(coverLetters).map(key => ({
        id: key,
        ...coverLetters[key]
      }));
      
      return { success: true, data: coverLettersList };
    } catch (error) {
      console.error('Error getting cover letters:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'An unknown error occurred',
        data: []
      };
    }
  },
  
  // Update a cover letter
  update: async (coverLetterId: string, coverLetterData: Partial<CoverLetterData>) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, message: 'User not authenticated' };
      }
      
      // Check if cover letter exists and belongs to user
      const currentSnapshot = await get(ref(realtimeDb, `coverLetters/${coverLetterId}`));
      const currentCoverLetter = currentSnapshot.val();
      
      if (!currentCoverLetter) {
        return { success: false, message: 'Cover letter not found' };
      }
      
      if (currentCoverLetter.userId !== user.uid) {
        return { success: false, message: 'Not authorized to update this cover letter' };
      }
      
      const updatedCoverLetter = {
        ...coverLetterData,
        updatedAt: new Date().toISOString()
      };
      
      await update(ref(realtimeDb, `coverLetters/${coverLetterId}`), updatedCoverLetter);
      
      return {
        success: true,
        data: {
          id: coverLetterId,
          ...currentCoverLetter,
          ...updatedCoverLetter
        }
      };
    } catch (error) {
      console.error('Error updating cover letter:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  },
  
  // Delete a cover letter
  delete: async (coverLetterId: string) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, message: 'User not authenticated' };
      }
      
      // Check if cover letter exists and belongs to user
      const snapshot = await get(ref(realtimeDb, `coverLetters/${coverLetterId}`));
      const coverLetterData = snapshot.val();
      
      if (!coverLetterData) {
        return { success: false, message: 'Cover letter not found' };
      }
      
      if (coverLetterData.userId !== user.uid) {
        return { success: false, message: 'Not authorized to delete this cover letter' };
      }
      
      await remove(ref(realtimeDb, `coverLetters/${coverLetterId}`));
      
      return { success: true, message: 'Cover letter deleted successfully' };
    } catch (error) {
      console.error('Error deleting cover letter:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  }
};

// AI service for Firebase Realtime Database - Uses our OpenAI integration
export const firebaseAiService = {
  // Enhance a resume with AI
  enhanceResume: async (resumeData: ResumeData) => {
    try {
      console.log('Enhancing resume with AI');
      return await aiService.enhanceResume(resumeData);
    } catch (error) {
      console.error('Error enhancing resume with AI:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'An unknown error occurred',
        data: resumeData // Return original data if enhancement fails
      };
    }
  },
  
  // Enhance a cover letter with AI
  enhanceCoverLetter: async (coverLetterData: CoverLetterData) => {
    try {
      console.log('Enhancing cover letter with AI');
      return await aiService.enhanceCoverLetter(coverLetterData);
      
    } catch (error) {
      console.error('Error enhancing cover letter with AI:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'An unknown error occurred',
        data: coverLetterData // Return original data if enhancement fails
      };
    }
  }
};
