export const UserLogin = (user, token) => {
  return {
    type: "LOGIN",
    payload: { user, token },
  };
};

export const UpdateUser = (user) => {
  return {
    type: "UPDATE_USER",
    payload: user,
  };
};

export const Logout = () => {
  return {
    type: "LOGOUT",
  };
};

export const isAuthenticated = (user) => {
  return {
    type: "TOKEN_AVAILABLE",
    payload: user,
  };
};

export const notAuthenticated = () => {
  return {
    type: "TOKEN_EXPIRED",
  };
};
