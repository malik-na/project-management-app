// src/services/authService.ts
import axios from 'axios';

const GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_USER_URL = 'https://api.github.com/user';

const CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID;
const REDIRECT_URI = `${window.location.origin}/auth/github/callback`;

export const authService = {
  login: () => {
    if (!CLIENT_ID) {
      console.error('GitHub Client ID is not defined');
      return;
    }
    const authUrl = `${GITHUB_AUTH_URL}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user,repo`;
    window.location.href = authUrl;
  },

  handleCallback: async (code: string) => {
    try {
      const tokenResponse = await axios.post('http://localhost:3001/api/github/oauth', { code });
      console.log('Token response:', tokenResponse.data);

      const { access_token } = tokenResponse.data;

      if (!access_token) {
        throw new Error('No access token received from GitHub');
      }

      console.log('Access token:', access_token);

      const userResponse = await axios.get(GITHUB_USER_URL, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      console.log('User response:', userResponse.data);

      return {
        user: userResponse.data,
        token: access_token,
      };
    } catch (error) {
      console.error('Error in handleCallback:', error);
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data);
        console.error('Response status:', error.response?.status);
        console.error('Response headers:', error.response?.headers);
      }
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
  },
};