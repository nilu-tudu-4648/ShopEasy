import { apiCallBegan, apiCallFailed, apiCallSuccess } from "../api";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { baseUrl } from "@/constants/Functions";

const apiMiddleware =
  ({ dispatch, getState }) =>
  (next) =>
  async (action) => {
    if (action.type !== apiCallBegan.type) {
      return next(action);
    }

    const {
      url,
      method,
      data,
      onSuccess,
      onStart,
      onError,
      headers = {},
    } = action.payload;

    // Dispatch onStart action if provided
    if (onStart) {
      dispatch({ type: onStart });
    }

    next(action);

    try {
      const userToken = await AsyncStorage.getItem("userToken");
      if (!userToken) {
        throw new Error("User token not found");
      }
      const response = await axios.request({
        // baseURL: baseUrl,
        url,
        method,
        data,
        headers: {
          ...headers,
          Authorization: `Bearer ${userToken}`,
        },
      });
      // Dispatch general success action
      dispatch(apiCallSuccess(response.data));

      // Dispatch specific success action if provided
      if (onSuccess) {
        dispatch({ type: onSuccess, payload: response.data });
      }
    } catch (error) {
      const errorMessage = error.response?.data || error.message;
      // Dispatch general error action
      dispatch(apiCallFailed(errorMessage));

      // Dispatch specific error action if provided
      if (onError) {
        dispatch({ type: onError, payload: errorMessage });
      }
    }
  };

export default apiMiddleware;
