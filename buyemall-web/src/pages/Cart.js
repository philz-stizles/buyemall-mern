import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { addUserCart } from "../actions/cart";
import ProductTableBody from "../components/table/ProductTableBody";
import { SET_PAYMENT_METHOD } from './../store/actions/types';

const Cart = ({ history }) => {
  const { cart, user } = useSelector((state) => ({ ...state }));
  let dispatch = useDispatch();
  
  const getTotalAmount = () => {
    return cart.reduce((acc, item) => {
      return acc + item.count * item.price;
    }, 0);
  };

  const saveCartToDb = () => {
    addUserCart(cart, user.token)
      .then((res) => {
        console.log("CART POST RES", res);
        if (res.data.ok) history.push("/checkout");
      })
      .catch((err) => console.log("cart save err", err));
  };

  const renderCartItems = () => (
    <table className="table table-bordered">
      <thead className="thead-light">
        <tr>
          <th scope="col">Image</th>
          <th scope="col">Title</th>
          <th scope="col">Price</th>
          <th scope="col">Brand</th>
          <th scope="col">Color</th>
          <th scope="col">Count</th>
          <th scope="col">Shipping</th>
          <th scope="col">Remove</th>
        </tr>
      </thead>

      {cart.map((p) => <ProductTableBody key={p._id} p={p} />)}
    </table>
  );

  return (
    <div className="container-fluid pt-2">
      <div className="row">
        <div className="col-md-8">
          <h4>Cart / {cart.length} Product</h4>

          {
            (!cart.length)
            ? <p>No products in cart. <Link to="/shop">Continue Shopping.</Link></p>
            : renderCartItems()
          }
        </div>
        <div className="col-md-4">
          <h4>Order Summary</h4>
          <hr />
          <p>Products</p>
          {cart.map(({ title, count, price }, i) => (
            <div key={i}>
              <p>{title} x {count} = ${price * count}</p>
            </div>
          ))}
          <hr />
          Total: <b>${getTotalAmount()}</b>
          <hr />
          {user ? (
            <>
              <button onClick={saveCartToDb} className="btn btn-sm btn-primary mt-2"
                disabled={!cart.length}>Proceed to Checkout</button>
              <br />
              <button onClick={() => {
                dispatch({ type: SET_PAYMENT_METHOD, payload: { cashOnDelivery: true }})
                saveCartToDb()
              }} className="btn btn-sm btn-warning mt-2"
              disabled={!cart.length}>Pay Cash on Delivery</button>
            </>
          ) : (
            <button className="btn btn-sm btn-primary mt-2">
              <Link to={{
                  pathname: "/login",
                  state: { from: "cart" },
                }}>Login to Checkout</Link>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
