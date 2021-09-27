import axios from "axios";

const baseUrl = process.env.REACT_APP_API_URL;

export const saveUserAddress = async (authtoken, address) =>
  await axios.post(`${baseUrl}/users/address`, { address }, { headers: { authtoken } });

export const addToUserWishlist = async (productId, authtoken) =>
  await axios.post(`${baseUrl}/users/wishlist`, { productId }, { headers: { authtoken } });

export const getUserWishlist = async (authtoken) => await axios.get(`${baseUrl}/users/wishlist`, { headers: { authtoken } });

export const removeFromUserWishlist = async (productId, authtoken) =>
  await axios.put(`${baseUrl}/users/wishlist/${productId}`, {}, { headers: { authtoken } });
