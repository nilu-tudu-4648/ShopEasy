import { combineReducers } from "redux";
import authReducer from "./reducers/authReducer";
import bookingReducer from "./reducers/bookingReducer";

export default combineReducers({
  authReducer,
  bookingReducer,
});