// src/services/githubService.ts
import axios from 'axios';
import { store } from '../store';

const GITHUB_API_URL = 'https://api.github.com';

const githubApi = axios.create({
  baseURL: GITHUB_API_URL,
});

githubApi.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `token ${token}`;
  }
  return config;
});

export const githubService = {
  // Fetch user repositories
  getUserRepos: async () => {
    const response = await githubApi.get('/user/repos');
    return response.data;
  },

  // Fetch repository details
  getRepoDetails: async (owner: string, repo: string) => {
    const response = await githubApi.get(`/repos/${owner}/${repo}`);
    return response.data;
  },

  // Fetch issues for a repository
  getRepoIssues: async (owner: string, repo: string) => {
    const response = await githubApi.get(`/repos/${owner}/${repo}/issues`);
    return response.data;
  },

  // Fetch pull requests for a repository
  getRepoPullRequests: async (owner: string, repo: string) => {
    const response = await githubApi.get(`/repos/${owner}/${repo}/pulls`);
    return response.data;
  },

  // Create a new issue
  createIssue: async (owner: string, repo: string, title: string, body: string) => {
    const response = await githubApi.post(`/repos/${owner}/${repo}/issues`, { title, body });
    return response.data;
  },

  // Create a new pull request
  createPullRequest: async (owner: string, repo: string, title: string, body: string, head: string, base: string) => {
    const response = await githubApi.post(`/repos/${owner}/${repo}/pulls`, { title, body, head, base });
    return response.data;
  },

  // Get user information
  getUserInfo: async () => {
    const response = await githubApi.get('/user');
    return response.data;
  },

  // Get repository contributors
  getRepoContributors: async (owner: string, repo: string) => {
    const response = await githubApi.get(`/repos/${owner}/${repo}/contributors`);
    return response.data;
  },
};