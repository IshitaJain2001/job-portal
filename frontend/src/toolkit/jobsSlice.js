import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  jobs: [],
  filteredJobs: [],
  currentJob: null,
  loading: false,
  error: null,
};

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setJobs: (state, action) => {
      state.jobs = action.payload;
      state.error = null;
    },
    setFilteredJobs: (state, action) => {
      state.filteredJobs = action.payload;
    },
    setCurrentJob: (state, action) => {
      state.currentJob = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    addJob: (state, action) => {
      state.jobs.unshift(action.payload);
    },
    updateJob: (state, action) => {
      const index = state.jobs.findIndex(job => job._id === action.payload._id);
      if (index !== -1) {
        state.jobs[index] = action.payload;
      }
    },
    deleteJob: (state, action) => {
      state.jobs = state.jobs.filter(job => job._id !== action.payload);
    },
  },
});

export const {
  setLoading,
  setJobs,
  setFilteredJobs,
  setCurrentJob,
  setError,
  addJob,
  updateJob,
  deleteJob,
} = jobsSlice.actions;
export default jobsSlice.reducer;
