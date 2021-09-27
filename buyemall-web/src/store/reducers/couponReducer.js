import { TOGGLE_COUPON_APPLY } from "../actions/types";

const INITIAL_STATE = { isApplied: false };

export const couponReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;
  switch (type) {
    case TOGGLE_COUPON_APPLY:
      return { ...state, isApplied: payload };
    default:
      return state;
  }
};
