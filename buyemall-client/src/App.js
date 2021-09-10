import React, { lazy, Suspense, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { LoadingOutlined } from '@ant-design/icons';
import { SET_AUTH_STATE } from './store/actions/types';

// UI Components
import Header from './components/Header';
import SideDrawer from './components/drawers/SideDrawer';

// Styles
import 'react-toastify/dist/ReactToastify.css';

import { auth } from './firebase';
import { getCurrentUser } from './actions/auth';
import Banner from './components/banners/Banner/Banner';

// Pages
const Register = lazy(() => import('./pages/auth/Register'));
const RegisterComplete = lazy(() => import('./pages/auth/RegisterComplete'));
const Login = lazy(() => import('./pages/auth/Login'));
const Home = lazy(() => import('./pages/Home'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const UserDashboard = lazy(() => import('./pages/user/UserDashboard'));
const UserRoute = lazy(() => import('./routes/UserRoute'));
const Password = lazy(() => import('./pages/user/Password'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const WishList = lazy(() => import('./pages/user/WishList'));
const AdminRoute = lazy(() => import('./routes/AdminRoute'));
const CategoryCreate = lazy(() =>
  import('./pages/admin/category/CategoryCreate')
);
const CategoryUpdate = lazy(() =>
  import('./pages/admin/category/CategoryUpdate')
);
const SubCategoryUpdate = lazy(() =>
  import('./pages/admin/sub-category/SubCategoryUpdate')
);
const ProductCreate = lazy(() => import('./pages/admin/product/ProductCreate'));
const SubCategoryCreate = lazy(() =>
  import('./pages/admin/sub-category/SubCategoryCreate')
);
const ProductList = lazy(() => import('./pages/admin/product/ProductList'));
const Category = lazy(() => import('./pages/category/Category'));
const SubCategory = lazy(() => import('./pages/sub-category/SubCategory'));
const Product = lazy(() => import('./pages/product/Product'));
const ProductUpdate = lazy(() => import('./pages/admin/product/ProductUpdate'));
const CouponCreate = lazy(() => import('./pages/admin/coupon/CouponCreate'));
const Payment = lazy(() => import('./pages/Payment'));
const Shop = lazy(() => import('./pages/Shop'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));

const App = () => {
  const dispatch = useDispatch();

  // Subscribe to firebase auth state. Any time there is a change, verify that the user is still authenticated
  // update redux accordingly
  useEffect(() => {
    // on app load, subscribe to auth state change
    const authChangeUnsubscription = auth.onAuthStateChanged(async (user) => {
      // If user is true, the user is still authenticated(remember, firebase handles all this)
      if (user) {
        console.log('user', user);

        // Retrieve the users idToken
        const idTokenResult = await user.getIdTokenResult();

        // Then use the token to retrieve the current users complete data from the database
        getCurrentUser(idTokenResult.token)
          .then((response) => {
            dispatch({
              type: SET_AUTH_STATE,
              payload: {
                _id: response.data._id,
                email: response.data.email,
                name: response.data.name,
                role: response.data.role,
                token: idTokenResult.token,
              },
            });
          })
          .catch((error) => {
            console.error(error);
          });

        // We do not require local storage since firebase is already providing a way to track loggedin state
        // If token expires, firebase will know and change the auth state
      }
    });
    return () => authChangeUnsubscription();
  }, [dispatch]);

  return (
    <Suspense
      fallback={
        <div className="col text-center p-5">
          <LoadingOutlined />
        </div>
      }
    >
      {/*fallback - some component or element to show before any page is rendered**/}
      <Banner message="We’re taking our brand to the next level| Celebrate with courses as low as $12.99 through July 19." />
      <Header />
      <SideDrawer />
      <ToastContainer />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/register/complete" component={RegisterComplete} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/forgot-password" component={ForgotPassword} />
        <AdminRoute exact path="/admin/dashboard" component={AdminDashboard} />
        <Route exact path="/product/:slug" component={Product} />
        <Route exact path="/category/:slug" component={Category} />
        <Route exact path="/sub-category/:slug" component={SubCategory} />
        <Route exact path="/shop" component={Shop} />
        <Route exact path="/cart" component={Cart} />
        <AdminRoute exact path="/admin/dashboard" component={AdminDashboard} />
        <AdminRoute exact path="/admin/categories" component={CategoryCreate} />
        <AdminRoute
          exact
          path="/admin/category/:slug"
          component={CategoryUpdate}
        />
        <AdminRoute
          exact
          path="/admin/sub-categories"
          component={SubCategoryCreate}
        />
        <AdminRoute
          exact
          path="/admin/sub-category/:slug"
          component={SubCategoryUpdate}
        />
        <AdminRoute exact path="/admin/coupons" component={CouponCreate} />
        <AdminRoute
          exact
          path="/admin/products/create"
          component={ProductCreate}
        />
        <AdminRoute
          exact
          path="/admin/products/update/:slug"
          component={ProductUpdate}
        />
        <AdminRoute exact path="/admin/products" component={ProductList} />
        <UserRoute exact path="/user/dashboard" component={UserDashboard} />
        <UserRoute exact path="/user/password" component={Password} />
        <UserRoute exact path="/user/wishlist" component={WishList} />
        <UserRoute exact path="/checkout" component={Checkout} />
        <UserRoute exact path="/payment" component={Payment} />
      </Switch>
    </Suspense>
  );
};

export default App;
