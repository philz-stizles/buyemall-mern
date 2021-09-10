import { combineReducers } from 'redux';

// Reducers
import { userReducer } from './userReducer';
import { cartReducer } from './cartReducer';
import { paymentReducer } from './paymentReducer';
import { drawerReducer } from './drawerReducer';
import { couponReducer } from './couponReducer';
import { searchReducer } from './searchReducer';

const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
  payment: paymentReducer,
  drawer: drawerReducer,
  coupon: couponReducer,
  search: searchReducer,
});

export default rootReducer;
