import { combineReducers } from "redux";

const userInfoReducer = (user = null, action) => {
  switch (action.type) {
    case "LOGIN":
      return action.payload;

    case "LOGOUT":
      return null;

    case "TOKEN_AVAILABLE":
      return action.payload;

    case "TOKEN_EXPIRED":
      return null;

    default:
      return user;
  }
};

const userTokenReducer = (
  user = JSON.parse(window.localStorage.getItem("trkar-token")) || null,
  action
) => {
  switch (action.type) {
    case "LOGIN":
      return action.payload;

    case "LOGOUT":
      return null;

    case "TOKEN_EXPIRED":
      return null;

    default:
      return user;
  }
};

export default combineReducers({
  user: userInfoReducer,
  userToken: userTokenReducer,
});
