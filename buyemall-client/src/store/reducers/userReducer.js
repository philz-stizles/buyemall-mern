import { LOGOUT, SET_AUTH_STATE } from "../actions/types";

export const userReducer = (state = null, action) => {
  const { type, payload } = action
  switch (type) {
    case SET_AUTH_STATE:
      return payload;
    case LOGOUT:
      return payload;
    default:
      return state;
  }
};