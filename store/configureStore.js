// import { configureStore } from "@reduxjs/toolkit";
// import reducer from "./reducer";

// export const store = configureStore({
//   reducer,
// });

import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer";
import apiMiddleware from "./middleware/apiMiddleware";

export const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat(apiMiddleware),
});
