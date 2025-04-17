const API_BASE_URL = 'http://localhost:5000/api';

export const api = {
  // Get all polls
  getPolls: async () => {
    const response = await fetch(`${API_BASE_URL}/polls`);
    return response.json();
  },

  // Create new poll
  createPoll: async (data: { question: string; options: string[] }) => {
    const response = await fetch(`${API_BASE_URL}/polls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Get poll by ID
  getPoll: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/polls/${id}`);
    return response.json();
  },

  // Update poll
  updatePoll: async (id: string, data: { question: string; options: any[] }) => {
    const response = await fetch(`${API_BASE_URL}/polls/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // Delete poll
  deletePoll: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/polls/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },

  // Vote on poll
//   votePoll: async (pollId: string, optionId: string) => {
//     const response = await fetch(`${API_BASE_URL}/polls/${pollId}/vote/${optionId}`, {
//       method: 'POST',
//     });
//     return response.json();
//   },

votePoll: async (pollId: string, optionId: string) => {
    const response = await fetch(`${API_BASE_URL}/polls/${pollId}/vote/${optionId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (data.voterId) {
      localStorage.setItem(`vote_${pollId}`, data.voterId);
    }
    return data;
  },
  
  hasVoted: (pollId: string) => {
    return !!localStorage.getItem(`vote_${pollId}`);
  }
};