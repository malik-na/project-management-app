// src/store/slices/githubSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../index';
import { githubService } from '../../services/githubService';
import { ReactNode } from 'react';

interface Repository {
  forks_count: ReactNode;
  stargazers_count: ReactNode;
  id: number;
  name: string;
  full_name: string;
  description: string;
  // Add other relevant fields
}

interface Issue {
  id: number;
  title: string;
  body: string;
  state: string;
  // Add other relevant fields
}

interface PullRequest {
  id: number;
  title: string;
  body: string;
  state: string;
  // Add other relevant fields
}

interface GithubState {
  repositories: Repository[];
  currentRepository: Repository | null;
  issues: Issue[];
  pullRequests: PullRequest[];
  loading: boolean;
  error: string | null;
}

const initialState: GithubState = {
  repositories: [],
  currentRepository: null,
  issues: [],
  pullRequests: [],
  loading: false,
  error: null,
};

const githubSlice = createSlice({
  name: 'github',
  initialState,
  reducers: {
    setRepositories(state, action: PayloadAction<Repository[]>) {
      state.repositories = action.payload;
    },
    setCurrentRepository(state, action: PayloadAction<Repository>) {
      state.currentRepository = action.payload;
    },
    setIssues(state, action: PayloadAction<Issue[]>) {
      state.issues = action.payload;
    },
    setPullRequests(state, action: PayloadAction<PullRequest[]>) {
      state.pullRequests = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  setRepositories,
  setCurrentRepository,
  setIssues,
  setPullRequests,
  setLoading,
  setError,
} = githubSlice.actions;

// Thunk for fetching user repositories
export const fetchUserRepos = (): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const repos = await githubService.getUserRepos();
    dispatch(setRepositories(repos));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError('Failed to fetch repositories'));
    dispatch(setLoading(false));
  }
};

// Thunk for fetching repository issues
export const fetchRepoIssues = (owner: string, repo: string): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const issues = await githubService.getRepoIssues(owner, repo);
    dispatch(setIssues(issues));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError('Failed to fetch issues'));
    dispatch(setLoading(false));
  }
};

// Thunk for fetching repository pull requests
export const fetchRepoPullRequests = (owner: string, repo: string): AppThunk => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const prs = await githubService.getRepoPullRequests(owner, repo);
    dispatch(setPullRequests(prs));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError('Failed to fetch pull requests'));
    dispatch(setLoading(false));
  }
};

export default githubSlice.reducer;