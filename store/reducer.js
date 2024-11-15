
import { combineReducers } from "redux";
import entitiesReducer from "./entities";

const root = (state, action) => {
  if (action.type === "RESET") {
    state = undefined;
  }
  return entitiesReducer(state, action);
};

const rootReducer = combineReducers({
  entities: root,
});

export default rootReducer;
