import axios from "axios";

const API = "http://localhost:5000/api/payments";

export const createPaymentOrder = async (orderId, token) => {
  const res = await axios.post(
    `${API}/create`,
    { orderId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const verifyPayment = async (data, token) => {
  const res = await axios.post(`${API}/verify`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
