// store/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    userInfo: null,
    userData: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.isAuthenticated = true;
      state.userInfo = action.payload.userInfo; 
      state.userData = action.payload.userData; 
    },
    clearUser: (state) => {
      state.isAuthenticated = false;
      state.userInfo = null;
      state.userData = null;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
