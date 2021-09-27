import axios from "axios";

const baseUrl = process.env.REACT_APP_API_URL;

export const createPaymentIntent = (isCouponApplied, authtoken) =>
  axios.post(`${baseUrl}/stripe/payment-intent`, { isCouponApplied }, { headers: { authtoken } });