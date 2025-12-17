import { useState } from "react";
import { motion } from "framer-motion";
import { createPaymentOrder, verifyPayment } from "../services/paymentService";
import { loadRazorpay } from "../utils/loadRazorpay";

const PayButton = ({ orderId }) => {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    if (!token) {
      alert("Please login first");
      return;
    }

    setError("");
    setLoading(true);

    // 1️⃣ Load Razorpay SDK
    const loaded = await loadRazorpay();
    if (!loaded) {
      setError("Razorpay SDK failed to load");
      setLoading(false);
      return;
    }

    try {
      // 2️⃣ Create Razorpay order
      const { razorpayOrderId, amount, key } =
        await createPaymentOrder(orderId, token);

      // 3️⃣ Razorpay options
      const options = {
        key,
        amount,
        currency: "INR",
        name: "Trash2Trade",
        description: "Material Purchase",
        order_id: razorpayOrderId,

        handler: async (response) => {
          try {
            await verifyPayment(
              {
                orderId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              token
            );

            alert("Payment Successful ✅");
            window.location.reload();
          } catch (err) {
            console.error(err);
            setError("Payment verification failed");
          }
        },

        prefill: {
          name: "Trash2Trade User",
        },

        theme: {
          color: "#10b981",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={loading}
        onClick={handlePayment}
        className={`px-5 py-2 rounded font-semibold text-white transition
          ${loading ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
        `}
      >
        {loading ? "Processing..." : "Pay Now"}
      </motion.button>

      {error && (
        <p className="mt-2 text-sm text-red-400 font-medium">
          {error}
        </p>
      )}
    </div>
  );
};

export default PayButton;
