// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // Ensure correct import

const store = configureStore({
  reducer: {
    auth: authReducer, // This key should match what you're trying to access
  },
});

export default store;
