import { ADD_TO_CART, REMOVE_FROM_CART } from "../actions/types";

let INITIAL_STATE = []

if(typeof window !== 'undefined'){
  const cart = localStorage.getItem('cart')
  if(cart){
    INITIAL_STATE = JSON.parse(cart);
  } else {
    INITIAL_STATE = []
  }
}

export const cartReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action
  switch (type) {
    case ADD_TO_CART:
      return payload;
    case REMOVE_FROM_CART:
      return payload;
    default:
      return state;
  }
};