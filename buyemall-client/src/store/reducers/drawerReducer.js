import { DRAWER_TOGGLE } from "../actions/types";

const INITIAL_STATE = { isVisible: false }

export const drawerReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action
  switch (type) {
    case DRAWER_TOGGLE:
      return { ...state, isVisible: payload };
    default:
      return state;
  }
};