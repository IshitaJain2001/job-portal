import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import jobsReducer from './jobsSlice';
import loginReducer from './LoginSlice';
import applicationHistory from './applicationSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobsReducer,
    login: loginReducer,
    applicationHistory: applicationHistory,
  },
});

export default store;