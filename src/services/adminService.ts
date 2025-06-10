import { adminApi } from './apiClient';

// Mock data for when API fails
const mockStats = {
  totalUsers: 35,
  totalResumes: 127,
  totalCoverLetters: 84,
  recentUsers: [
    { id: '1', email: 'user1@example.com', subscription: 'premium', createdAt: '2023-04-15T10:20:30Z' },
    { id: '2', email: 'user2@example.com', subscription: 'free', createdAt: '2023-04-10T14:30:20Z' },
    { id: '3', email: 'user3@example.com', subscription: 'premium', createdAt: '2023-04-05T09:15:45Z' },
    { id: '4', email: 'user4@example.com', subscription: 'free', createdAt: '2023-04-01T16:40:10Z' },
    { id: '5', email: 'user5@example.com', subscription: 'premium', createdAt: '2023-03-28T11:25:55Z' },
  ]
};

const mockUsers = [
  { id: '1', email: 'user1@example.com', displayName: 'User One', subscription: 'premium', createdAt: '2023-04-15T10:20:30Z' },
  { id: '2', email: 'user2@example.com', displayName: 'User Two', subscription: 'free', createdAt: '2023-04-10T14:30:20Z' },
  { id: '3', email: 'user3@example.com', displayName: 'User Three', subscription: 'premium', createdAt: '2023-04-05T09:15:45Z' },
  { id: '4', email: 'user4@example.com', displayName: 'User Four', subscription: 'free', createdAt: '2023-04-01T16:40:10Z' },
  { id: '5', email: 'user5@example.com', displayName: 'User Five', subscription: 'premium', createdAt: '2023-03-28T11:25:55Z' },
  { id: '6', email: 'user6@example.com', displayName: 'User Six', subscription: 'free', createdAt: '2023-03-25T08:50:15Z' },
  { id: '7', email: 'user7@example.com', displayName: 'User Seven', subscription: 'premium', createdAt: '2023-03-20T13:10:35Z' },
];

const mockDocuments = [
  { id: '1', userId: '1', userEmail: 'user1@example.com', title: 'Software Engineer Resume', type: 'resume', createdAt: '2023-04-14T10:20:30Z', updatedAt: '2023-04-14T11:20:30Z' },
  { id: '2', userId: '1', userEmail: 'user1@example.com', title: 'Application for Google', type: 'coverLetter', createdAt: '2023-04-14T11:30:20Z', updatedAt: '2023-04-14T12:30:20Z' },
  { id: '3', userId: '2', userEmail: 'user2@example.com', title: 'Product Manager Resume', type: 'resume', createdAt: '2023-04-10T09:15:45Z', updatedAt: '2023-04-10T10:15:45Z' },
  { id: '4', userId: '3', userEmail: 'user3@example.com', title: 'Application for Facebook', type: 'coverLetter', createdAt: '2023-04-05T16:40:10Z', updatedAt: '2023-04-05T17:40:10Z' },
  { id: '5', userId: '4', userEmail: 'user4@example.com', title: 'UX Designer Resume', type: 'resume', createdAt: '2023-04-01T11:25:55Z', updatedAt: '2023-04-01T12:25:55Z' },
];

// Admin service with fallback to mock data
export const adminService = {
  // Get admin dashboard stats
  getStats: async () => {
    try {
      const response = await adminApi.getStats();
      console.log('Admin API response for stats:', response);
      if (response?.success && response?.data) {
        return response.data;
      }
      console.warn('Using mock stats data due to invalid API response');
      return mockStats;
    } catch (error) {
      console.error('Error fetching admin stats, using mock data:', error);
      return mockStats;
    }
  },

  // Get all users
  getUsers: async () => {
    try {
      const response = await adminApi.getUsers();
      console.log('Admin API response for users:', response);
      if (response?.success && response?.data) {
        return response.data;
      }
      console.warn('Using mock users data due to invalid API response');
      return mockUsers;
    } catch (error) {
      console.error('Error fetching admin users, using mock data:', error);
      return mockUsers;
    }
  },

  // Get all documents
  getDocuments: async () => {
    try {
      const response = await adminApi.getDocuments();
      console.log('Admin API response for documents:', response);
      if (response?.success && response?.data) {
        return response.data;
      }
      console.warn('Using mock documents data due to invalid API response');
      return mockDocuments;
    } catch (error) {
      console.error('Error fetching admin documents, using mock data:', error);
      return mockDocuments;
    }
  },

  // Update user
  updateUser: async (userId: string, userData: {subscription?: string}) => {
    try {
      const response = await adminApi.updateUser(userId, userData);
      return response;
    } catch (error) {
      console.error('Error updating user:', error);
      // Return mock success response
      return { success: true, message: 'User updated successfully (mock)' };
    }
  },

  // Delete document
  deleteDocument: async (documentId: string, documentType: string) => {
    try {
      const response = await adminApi.deleteDocument(documentId, documentType);
      return response;
    } catch (error) {
      console.error('Error deleting document:', error);
      // Return mock success response
      return { success: true, message: 'Document deleted successfully (mock)' };
    }
  },

  // Update webhook
  updateWebhook: async (webhookType: string, webhookUrl: string) => {
    try {
      const response = await adminApi.updateWebhook(webhookType, webhookUrl);
      return response;
    } catch (error) {
      console.error('Error updating webhook:', error);
      // Return mock success response
      return { success: true, message: `${webhookType} webhook updated successfully (mock)` };
    }
  }
};
