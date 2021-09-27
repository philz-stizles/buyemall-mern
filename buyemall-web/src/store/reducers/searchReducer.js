import { SEARCH_QUERY } from '../actions/types';

let INITIAL_STATE = { text: '' };

export const searchReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
    case SEARCH_QUERY: {
      return { ...state, text: payload };
    }
    default:
      return state;
  }
};
