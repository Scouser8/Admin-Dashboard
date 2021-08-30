import { combineReducers } from "redux";

const userInfoReducer = (
  user = JSON.parse(window.localStorage.getItem("my-task-user")) || null,
  action
) => {
  switch (action.type) {
    case "LOGIN":
      return action.payload.user;

    case "UPDATE_USER":
      return action.payload;

    case "LOGOUT":
      return null;

    default:
      return user;
  }
};

const userTokenReducer = (
  token = JSON.parse(window.localStorage.getItem("my-task-token")) || null,
  action
) => {
  switch (action.type) {
    case "LOGIN":
      return action.payload.token;

    case "LOGOUT":
      return null;

    default:
      return token;
  }
};

export default combineReducers({
  user: userInfoReducer,
  userToken: userTokenReducer,
});
