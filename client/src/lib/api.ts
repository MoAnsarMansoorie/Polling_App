import axios from 'axios';

const baseURL = 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data and redirect to login on unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const api = {
  // Auth (Admin only)
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // Polls (Public access)
  getPolls: async () => {
    try {
      const response = await axiosInstance.get('/polls');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching polls:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch polls');
    }
  },

  getPoll: async (id: string) => {
    try {
      const response = await axiosInstance.get(`/polls/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch poll');
    }
  },

  // Voting (Public access)
  votePoll: async (pollId: string, optionId: string, voterId?: string) => {
    try {
      const response = await axiosInstance.post(`/polls/${pollId}/vote/${optionId}`, {
        voterId
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to vote');
    }
  },

  hasVoted: (pollId: string) => {
    return !!localStorage.getItem(`vote_${pollId}`);
  },

  // Admin only operations
  createPoll: async (pollData: { question: string; options: string[] }) => {
    try {
      const response = await axiosInstance.post('/admin/polls', pollData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create poll');
    }
  },

  updatePoll: async (id: string, pollData: { question: string; options: string[] }) => {
    try {
      const response = await axiosInstance.put(`/admin/polls/${id}`, pollData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update poll');
    }
  },

  deletePoll: async (id: string) => {
    try {
      const response = await axiosInstance.delete(`/admin/polls/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete poll');
    }
  }
};