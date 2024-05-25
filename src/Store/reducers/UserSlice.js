import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    updateUser: (state, action) => {
      if (state.user) {
        console.log("previos user:", state.user);
        console.log("action.payload", action.payload);
        state.user = { ...state.user, ...action.payload };
      }

      console.log("updated user:", state.user);
    }
  }
});

export const { setUser, clearUser, updateUser } = userSlice.actions;

export const selectUser = (state) => state.user.user;

export default userSlice.reducer;
