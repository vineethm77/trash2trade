/* ===============================
   EMAIL TEMPLATES – Trash2Trade
================================ */

/* -------- WELCOME EMAIL -------- */
export const welcomeEmail = (name) => `
  <h2>Welcome to Trash2Trade, ${name} 👋</h2>
  <p>You have successfully registered on <b>Trash2Trade</b>.</p>
  <p>Start trading industrial by-products and reduce waste.</p>
`;

/* -------- ORDER PLACED (SELLER) -------- */
export const orderPlacedEmail = (materialName) => `
  <h2>New Order Received 📦</h2>
  <p>You received a new order for:</p>
  <p><b>${materialName}</b></p>
`;

/* -------- ORDER APPROVED (BUYER) -------- */
export const orderApprovedEmail = (materialName) => `
  <h2>Order Approved ✅</h2>
  <p>Your order for <b>${materialName}</b> has been approved by the seller.</p>
`;

/* -------- ORDER REJECTED (BUYER) -------- */
export const orderRejectedEmail = (materialName) => `
  <h2>Order Rejected ❌</h2>
  <p>Your order for <b>${materialName}</b> was rejected by the seller.</p>
`;

/* -------- ORDER SHIPPED (BUYER) -------- */
export const orderShippedEmail = (materialName) => `
  <h2>Order Shipped 🚚</h2>
  <p>Your order for <b>${materialName}</b> has been shipped.</p>
`;

/* -------- ORDER COMPLETED (SELLER) -------- */
export const orderCompletedEmail = (materialName) => `
  <h2>Order Completed 🎉</h2>
  <p>The order for <b>${materialName}</b> has been successfully completed.</p>
`;
