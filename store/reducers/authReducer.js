import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  loading: true,
  loggedUser: null,
};

const authReducer = createSlice({
  name: "authReducer",
  initialState,
  reducers: {
    // ################################################################
    setUser: (authReducer, action) => {
      authReducer.loggedUser = action.payload;
    },
    
  },
});

export const {
  setUser,
} = authReducer.actions;

export default authReducer.reducer;
