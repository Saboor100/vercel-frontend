import axios from 'axios';
import { ResumeData, CoverLetterData } from '@/types/documents';
import { auth, realtimeDb } from './firebase';
import { toast } from 'sonner';
import { 
  resumeService, 
  coverLetterService, 
  userService,
  firebaseAiService
} from './firebaseRealtimeDb';
import { ref, set, get, push, remove, update, query, orderByChild, equalTo } from 'firebase/database';
import Stripe from 'stripe';
import { getAuth } from 'firebase/auth';
// Import i18n for language selection
import i18n from '@/i18n';

// Create an Axios instance for any remaining API needs
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://vercel-backend-coral-kappa.vercel.app/',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
  withCredentials: true
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const user = auth.currentUser;
      if (user) {
        // Get current token without forcing refresh every time
        const token = await user.getIdToken(false);
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Adding auth token to request:', config.url);
      } else {
        console.warn('No user logged in for API request that may require authentication');
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error:', error.response?.data || error.message);
    
    // Show toast notification for API errors
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    toast.error(errorMessage);
    
    return Promise.reject(error);
  }
);

// Auth API endpoints - using Firebase Realtime DB
export const authApi = {
  login: async (user: { uid: string; email: string | null }) => {
    try {
      console.log('Firebase user logged in:', user.email);
  
      const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY, {
        apiVersion: '2025-03-31.basil',
      });
  
      const userRef = ref(realtimeDb, `users/${user.uid}`);
      const snapshot = await get(userRef);
      let existingProfile = snapshot.val();
  
      let stripeCustomerId = existingProfile?.stripeCustomerId;
  
      // If no Stripe customer ID, create one
      if (!stripeCustomerId && user.email) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: auth.currentUser?.displayName || '',
          metadata: {
            firebaseUID: user.uid,
          },
        });
        stripeCustomerId = customer.id;
      }
  
      // Initialize subscriptionData with default values
      let subscriptionData = {
        id: null,
        status: 'inactive',
        plan: 'free',
        cancel_at_period_end: false,
      };
  
      if (stripeCustomerId) {
        const subscriptions = await stripe.subscriptions.list({
          customer: stripeCustomerId,
          status: 'active',
          limit: 1,
        });
  
        if (subscriptions.data.length > 0) {
          const sub = subscriptions.data[0];
          const price = sub.items.data[0]?.price;
  
          // Always use the product's name as the subscription name
          if (price?.product) {
            const product = await stripe.products.retrieve(price.product as string);
            subscriptionData = {
              id: sub.id,
              status: sub.status,
              plan: product.name || price.id,
              cancel_at_period_end: sub.cancel_at_period_end,
            };
          }
        }
      }
  
      // Update the user profile in Firebase with subscriptionData
      await userService.updateProfile({
        displayName: auth.currentUser?.displayName || '',
        subscriptionData: subscriptionData,  // Pass the full subscriptionData
        stripeCustomerId: stripeCustomerId,
      });
  
      return {
        success: true,
        data: {
          user: {
            id: user.uid,
            email: user.email,
            stripeCustomerId: stripeCustomerId,
            subscriptionData: subscriptionData,  // Return the subscription data
          },
        },
      };
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  },
  
  logout: async () => {
    return {
      success: true,
      message: 'Logged out successfully'
    };
  },
  
  getUser: async () => {
    return await userService.getProfile();
  },
};

// Resume API endpoints - using Firebase Realtime DB
export const resumeApi = {
  generate: async (resumeData: ResumeData) => {
    try {
      console.log('Generating resume with data:', resumeData);
      
      // First enhance the resume with AI if needed
      const enhanced = await firebaseAiService.enhanceResume(resumeData);
      
      if (!enhanced.success) {
        return enhanced;
      }
      
      // Save the enhanced resume to Firebase Realtime DB
      return await resumeService.create(enhanced.data);
    } catch (error) {
      console.error('Resume generate API error:', error);
      throw error;
    }
  },
  
  getById: async (resumeId: string) => {
    return await resumeService.getById(resumeId);
  },
  
  getAll: async () => {
    return await resumeService.getAll();
  },

  // Add enhance and enhanceSummary for backend API with language
  enhance: async (resumeData: ResumeData) => {
    try {
      const lang = i18n.language || 'en';
      console.log('Sending resume enhance request with lang:', lang);
      const response = await apiClient.post('/resume/enhance', { resumeData, lang });
      return response.data;
    } catch (error) {
      console.error('Resume enhance API error:', error);
      throw error;
    }
  },

  enhanceSummary: async (resumeData: ResumeData) => {
    try {
      const lang = i18n.language || 'en';
      console.log('Sending resume enhance-summary request with lang:', lang);
      const response = await apiClient.post('/resume/enhance-summary', { resumeData, lang });
      return response.data;
    } catch (error) {
      console.error('Resume enhance-summary API error:', error);
      throw error;
    }
  }
};

// Cover Letter API endpoints - using Firebase Realtime DB
export const coverLetterApi = {
  generate: async (coverLetterData: CoverLetterData) => {
    try {
      console.log('Generating cover letter with data:', coverLetterData);
      
      // First enhance the cover letter with AI if needed
      const enhanced = await firebaseAiService.enhanceCoverLetter(coverLetterData);
      
      if (!enhanced.success) {
        return enhanced;
      }
      
      // Save the enhanced cover letter to Firebase Realtime DB
      return await coverLetterService.create(enhanced.data);
    } catch (error) {
      console.error('Cover letter generate API error:', error);
      throw error;
    }
  },
  
  getById: async (coverLetterId: string) => {
    return await coverLetterService.getById(coverLetterId);
  },
  
  getAll: async () => {
    return await coverLetterService.getAll();
  },

  // Add enhance for backend API with language
  enhance: async (coverLetterData: CoverLetterData) => {
    try {
      const lang = i18n.language || 'en';
      console.log('Sending cover letter enhance request with lang:', lang);
      const response = await apiClient.post('/cover-letter/enhance', { coverLetterData, lang });
      console.log('response from cover letter enhance API:', response.data);
      return response.data;
    } catch (error) {
      console.error('Cover letter enhance API error:', error);
      throw error;
    }
  }
};

// Payment API endpoints - integrated with Stripe
export const paymentApi = {
  // Updated to accept currency parameter
  getPlans: async (currency: string) => {
    try {
      const response = await apiClient.get(`/payment/plans?currency=${currency}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching plans:', error);
      return {
        success: false,
        message: 'Failed to fetch subscription plans'
      };
    }
  },

  // Updated to accept currency parameter
  createCheckoutSession: async (plan: 'basic' | 'pro', currency: string) => {
    try {
      const response = await apiClient.post('/payment/checkout', { plan, currency });
      
      if (response.data.success && response.data.data.url) {
        // Redirect to Stripe checkout
        window.location.href = response.data.data.url;
        return { success: true };
      }
      
      return response.data;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      return {
        success: false,
        message: 'Failed to create checkout session'
      };
    }
  },
  
  verifyPaymentSuccess: async (sessionId: string) => {
    try {
      const user = getAuth().currentUser;
      if (user) {
        const token = await user.getIdToken();
        const response = await apiClient.get(`/payment/verify?session_id=${sessionId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        return response.data;
      } else {
        return {
          success: false,
          message: 'User not authenticated'
        };
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      return {
        success: false,
        message: 'Failed to verify payment'
      };
    }
  },
  
  unsubscribe: async () => {
    try {
      const response = await apiClient.post('/payment/unsubscribe');
      return response.data;
    } catch (error) {
      console.error('Error unsubscribing:', error);
      return {
        success: false,
        message: 'Failed to cancel subscription'
      };
    }
  }
};

// Admin API endpoints
export const adminApi = {
  getStats: async () => {
    try {
      const response = await apiClient.get('/admin/stats');
      console.log('Admin stats API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting admin stats:', error);
      throw error;
    }
  },
  
  getUsers: async () => {
    try {
      const response = await apiClient.get('/admin/users');
      console.log('Admin users API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting admin users:', error);
      throw error;
    }
  },
  
  getDocuments: async () => {
    try {
      const response = await apiClient.get('/admin/documents');
      console.log('Admin documents API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error getting admin documents:', error);
      throw error;
    }
  },
  
  updateWebhook: async (webhookType: string, webhookUrl: string) => {
    try {
      const response = await apiClient.post('/admin/webhooks', { type: webhookType, url: webhookUrl });
      return response.data;
    } catch (error) {
      console.error('Error updating webhook:', error);
      throw error;
    }
  },

  updateUser: async (userId: string, userData: {subscription?: string}) => {
    try {
      const response = await apiClient.put(`/admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  deleteDocument: async (documentId: string, documentType: string) => {
    try {
      const response = await apiClient.delete(`/admin/documents/${documentId}`, {
        data: { type: documentType }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }
};

// Health check function
export const checkServerHealth = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    return { status: 'error', message: 'Server unavailable' };
  }
};

export default apiClient;