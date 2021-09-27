import React, { useState } from "react";
import { Card, Tooltip } from "antd";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import laptop from "../../images/laptop.png";
import { Link } from "react-router-dom";
import { renderAverageRatings } from "../../utils/ratings";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { ADD_TO_CART, DRAWER_TOGGLE } from "../../store/actions/types";

const { Meta } = Card;

const ProductCard = ({ product }) => {
  const [tooltip, setTooltip] = useState("Click to add");

  // // redux
  const { user, cart } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();

  const handleAddToCart = (product) => {
    // create cart array
    let cart = [];
    if (typeof window !== "undefined") { // Local storage is part of the window object,
      // so check if we have the window object before using localStorage

      // if cart is in local storage GET it
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      console.log('cart before push', cart)
      // push new product to cart
      cart.push({
        ...product,
        count: 1,
      });
      console.log('cart after push', cart)

      // remove duplicates
      let unique = _.uniqWith(cart, _.isEqual);
      console.log('lodash unique', unique)

      // save to local storage
      localStorage.setItem("cart", JSON.stringify(unique));
      
      // show tooltip
      setTooltip("Added");

      // add to reeux state
      dispatch({ type: ADD_TO_CART, payload: unique });

      // show cart items in side drawer
      dispatch({ type: DRAWER_TOGGLE, payload: true });
    }
  };

  const { images, title, description, slug, price } = product;
  
  return (
    <>
      {product && product.ratings && product.ratings.length > 0 
        ? renderAverageRatings(product)
        : <div className="text-center pt-1 pb-3">No rating yet</div>
      }

      <Card
        cover={
          <img
            alt=""
            src={images && images.length ? images[0].url : laptop}
            style={{ height: "150px", objectFit: "cover" }}
            className="p-1"
          />
        }
        actions={[
          <Link to={`/product/${slug}`}>
            <EyeOutlined className="text-warning" /> <br /> View Product
          </Link>,
          <Tooltip title={tooltip}>
            <button style={{
              border: 'none',
              backgroundColor: 'unset',
              cursor: 'pointer'
            }} onClick={() => handleAddToCart(product)} disabled={product.quantity < 1}>
              <ShoppingCartOutlined className="text-danger" /> <br /> 
              { (product.quantity < 1) ? 'Out of Stock' : 'Add to Cart' }
            </button>
          </Tooltip>,
        ]}
      >
        <Meta
          title={`${title} - $${price}`}
          description={`${description && description.substring(0, 40)}...`}
        />
      </Card>
    </>
  );
};

export default ProductCard;
