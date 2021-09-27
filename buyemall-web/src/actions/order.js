import axios from "axios";

const baseUrl = process.env.REACT_APP_API_URL;

export const createOrder = async (stripeResponse, authtoken) =>
  await axios.post(`${baseUrl}/orders`, { stripeResponse }, { headers: { authtoken } });

export const createCashOrder = async (
  authtoken,
  COD,
  couponTrueOrFalse
) =>
  await axios.post(
    `${baseUrl}/orders/cash-order`,
    { couponApplied: couponTrueOrFalse, COD },
    {
      headers: {
        authtoken,
      },
    }
  );


export const getUserOrders = async (authtoken) =>
  await axios.get(`${baseUrl}/orders/by-user`, { headers: { authtoken } });


export const getAllOrders = async (authtoken) =>
  await axios.get(`${baseUrl}/orders`, {
    headers: {
      authtoken,
    },
  });

export const changeOrderStatus = async (orderId, orderStatus, authtoken) =>
  await axios.put(
    `${baseUrl}/orders/change-status`,
    { orderId, orderStatus },
    {
      headers: {
        authtoken,
      },
    }
  );