import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Project {
  id: string;
  name: string;
  description: string;
}

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
}

const initialState: ProjectState = {
  projects: [],
  currentProject: null,
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProjects(state, action: PayloadAction<Project[]>) {
      state.projects = action.payload;
    },
    setCurrentProject(state, action: PayloadAction<Project | null>) {
      state.currentProject = action.payload;
    },
    addProject(state, action: PayloadAction<Project>) {
      state.projects.push(action.payload);
    },
  },
});

export const { setProjects, setCurrentProject, addProject } = projectSlice.actions;
export default projectSlice.reducer;