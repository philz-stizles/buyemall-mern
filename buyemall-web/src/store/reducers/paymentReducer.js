import { SET_PAYMENT_METHOD } from "../actions/types";

const INITIAL_STATE = {
  cashOnDelivery: false
}

export const paymentReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case SET_PAYMENT_METHOD:
      return { ...state, ...payload };
    default:
      return state;
  }
};