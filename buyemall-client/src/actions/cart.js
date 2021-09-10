import axios from "axios";

const baseUrl = process.env.REACT_APP_API_URL;

export const addUserCart = async (cart, authtoken) =>
  await axios.post(`${baseUrl}/carts`, { cart }, { headers: { authtoken } });

export const getUserCart = async (authtoken) =>
  await axios.get(`${baseUrl}/carts`, { headers: { authtoken } });

export const emptyUserCart = async (authtoken) =>
  await axios.delete(`${baseUrl}/carts`, { headers: { authtoken } });

export const applyCoupon = async (coupon, authtoken) =>
  await axios.post(`${baseUrl}/carts/coupon`, { coupon }, { headers: { authtoken } });
