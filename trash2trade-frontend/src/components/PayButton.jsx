import { createPaymentOrder, verifyPayment } from "../services/paymentService";
import { loadRazorpay } from "../utils/loadRazorpay";

const PayButton = ({ orderId }) => {
  const token = localStorage.getItem("token");

  const handlePayment = async () => {
    if (!token) {
      alert("Please login first");
      return;
    }

    // 1️⃣ Load Razorpay SDK
    const loaded = await loadRazorpay();
    if (!loaded) {
      alert("Razorpay SDK failed to load");
      return;
    }

    try {
      // 2️⃣ Create Razorpay order from backend
      const { razorpayOrderId, amount, key } =
        await createPaymentOrder(orderId, token);

      // 3️⃣ Razorpay checkout options
      const options = {
        key,
        amount, // already in paise from backend
        currency: "INR",
        name: "Trash2Trade",
        description: "Material Purchase",
        order_id: razorpayOrderId,

        handler: async (response) => {
          try {
            // 4️⃣ Verify payment in backend
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
            alert("Payment verification failed");
          }
        },

        prefill: {
          name: "Trash2Trade User",
        },

        theme: {
          color: "#0A65CC",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Payment failed");
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
    >
      Pay Now
    </button>
  );
};

export default PayButton;
