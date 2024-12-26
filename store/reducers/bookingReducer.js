import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  loading: true,
  vehicles: null,
  userBookings: null,
  myVehicles: null,
};

const bookingReducer = createSlice({
  name: "bookingReducer",
  initialState,
  reducers: {
    // ################################################################
    setUserBookings: (bookingReducer, action) => {
      bookingReducer.userBookings = action.payload;
    },
    setVehicles: (bookingReducer, action) => {
      bookingReducer.vehicles = action.payload;
    },
    setMyVehicles: (bookingReducer, action) => {
      bookingReducer.myVehicles = action.payload;
    },
  },
});

export const { setUserBookings, setVehicles, setMyVehicles } = bookingReducer.actions;

export default bookingReducer.reducer;
