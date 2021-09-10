import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { saveUserAddress } from "../actions/user";
import { createCashOrder } from "../actions/order";
import { emptyUserCart, applyCoupon, getUserCart } from "../actions/cart";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { TOGGLE_COUPON_APPLY, ADD_TO_CART, SET_PAYMENT_METHOD } from "../store/actions/types";
import {  } from './../store/actions/types';

const Checkout = ({ history }) => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [addressSaved, setAddressSaved] = useState(false);
  const [coupon, setCoupon] = useState("");
  // discount price
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [discountError, setDiscountError] = useState("");

  const dispatch = useDispatch();
  const { user, payment, coupon: couponReducer } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    getUserCart(user.token).then((res) => {
      console.log("user cart res", JSON.stringify(res.data, null, 4));
      setProducts(res.data.products);
      setTotal(res.data.cartTotal);
    });
  }, [user.token]);

  const emptyCart = () => {
    // remove from local storage
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
    }
    // remove from redux
    dispatch({
      type: ADD_TO_CART,
      payload: [],
    });
    // remove from backend
    emptyUserCart(user.token).then((res) => {
      setProducts([]);
      setTotal(0);
      setTotalAfterDiscount(0);
      setCoupon("");
      toast.success("Cart is empty. Continue shopping.");
    });
  };

  const saveAddressToDb = () => {
    saveUserAddress(user.token, address).then((res) => {
      if (res.data.ok) {
        setAddressSaved(true);
        toast.success("Address saved");
      }
    });
  };

  const applyDiscountCoupon = () => {
    applyCoupon(coupon, user.token).then((res) => {
      console.log("RES ON COUPON APPLIED", res.data);
      if (res.data) {
        setTotalAfterDiscount(res.data);
        // update redux coupon applied true
        dispatch({ type: TOGGLE_COUPON_APPLY, payload: true });
      }
      // error
      if (res.data.err) {
        setDiscountError(res.data.err);
        // update redux coupon applied false
        dispatch({ type: TOGGLE_COUPON_APPLY, payload: false });
      }
    });
  };

  const handleCreateCashOrder = () => {
    createCashOrder(user.token, payment.cashOnDelivery, couponReducer.isApplied).then((res) => {
      console.log("USER CASH ORDER CREATED RES ", res);
      // empty cart form redux, local Storage, reset coupon, reset COD, redirect
      if (res.data.ok) {
        // empty local storage
        if (typeof window !== "undefined") localStorage.removeItem("cart");
        // empty redux cart
        dispatch({
          type: ADD_TO_CART,
          payload: [],
        });
        // empty redux coupon
        dispatch({
          type: TOGGLE_COUPON_APPLY,
          payload: false,
        });
        // empty redux CashOnDelivery
        dispatch({ type: SET_PAYMENT_METHOD, payload: { cashOnDelivery: true }});
        // empty cart from backend
        emptyUserCart(user.token);
        // redirect the user to their history page
        setTimeout(() => {
          history.push("/user/dashboard");
        }, 1000);
      }
    });
  }

  const renderAddressForm = () => (
    <>
      <ReactQuill theme="snow" value={address} onChange={setAddress} />
      <button className="btn btn-primary mt-2" onClick={saveAddressToDb}>Save</button>
    </>
  );

  const renderProductSummary = () =>
    products.map((p, i) => (
      <div key={i}>
        <p>{p.product.title} ({p.color}) x {p.count} ={" "}{p.product.price * p.count}</p>
      </div>
    ));

  const renderApplyCouponForm = () => (
    <>
      <input
        onChange={(e) => {
          setCoupon(e.target.value);
          setDiscountError("");
        }}
        value={coupon}
        type="text"
        className="form-control" />
      <button onClick={applyDiscountCoupon} className="btn btn-primary mt-2">Apply</button>
    </>
  );

  return (
    <div className="row">
      <div className="col-md-6">
        <h4>Delivery Address</h4>
        <br />
        <br />
        {renderAddressForm()}
        <hr />
        <h4>Got Coupon?</h4>
        <br />
        {renderApplyCouponForm()}
        <br />
        {discountError && <p className="bg-danger p-2">{discountError}</p>}
      </div>

      <div className="col-md-6">
        <h4>Order Summary</h4>
        <hr />
        <p>Products {products.length}</p>
        <hr />
        {renderProductSummary()}
        <hr />
        <p>Cart Total: {total}</p>

        {totalAfterDiscount > 0 && (
          <p className="bg-success p-2">
            Discount Applied: Total Payable: ${totalAfterDiscount}
          </p>
        )}

        <div className="row">
          <div className="col-md-6">
            {payment.cashOnDelivery ? (
              <button
              className="btn btn-primary"
              disabled={!addressSaved || !products.length}
                onClick={handleCreateCashOrder}>Place Order</button>
            ) : (
              <button
              className="btn btn-primary"
              disabled={!addressSaved || !products.length}
                  onClick={() => history.push("/payment")}>Place Order</button>
              )
            }
          </div>

          <div className="col-md-6">
            <button
              disabled={!products.length}
              onClick={emptyCart}
              className="btn btn-primary">Empty Cart</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
