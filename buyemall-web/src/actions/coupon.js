import axios from "axios";

export const createCoupon = async (data, authtoken) =>
  await axios.post(`${process.env.REACT_APP_API_URL}/coupons`, data, {
    headers: {
      authtoken,
    },
  });

export const getCoupons = async () => await axios.get(`${process.env.REACT_APP_API_URL}/coupons`);

export const removeCoupon = async (id, authtoken) => {
  return await axios.delete(`${process.env.REACT_APP_API_URL}/coupons/${id}`, { headers: { authtoken } })
}