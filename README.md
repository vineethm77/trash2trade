# ♻️ Trash2Trade – Industrial By-Product Exchange Platform

Trash2Trade is a **MERN-stack based B2B web application** designed to facilitate the exchange of reusable industrial by-products between industries, promoting **circular economy**, **sustainability**, and **resource efficiency**.

The platform enables industries to list, discover, trade, and manage industrial waste materials with **secure authentication**, **admin controls**, **logistics tracking**, **payments**, and **analytics dashboards**.

---

## 📌 Problem Statement

Industrial manufacturing generates large volumes of reusable by-products such as scrap metals, plastics, chemicals, packaging residues, and e-waste.

Existing reuse systems are fragmented, manually driven, and lack transparency, resulting in unnecessary waste disposal and economic loss.

**Trash2Trade** addresses this problem by providing a **digital marketplace** that connects industries, optimizes material reuse, and supports sustainable industrial practices.

---

## 🚀 Key Features

### 👤 User Features
- User registration & secure login (JWT based)
- Role-based access (Buyer, Seller, Admin)
- Material listing & browsing
- Order placement & tracking
- Payment integration (Razorpay)
- Order lifecycle management
- Real-time status updates

### 🧑‍💼 Admin Features
- Admin dashboard with analytics
- User management (Block / Unblock users)
- Order monitoring & cancellation
- Revenue and activity insights
- Animated KPI cards & charts
- Secure admin-only routes

### 🔒 Security
- JWT authentication
- Role-based authorization
- Blocked users cannot login or access APIs
- Protected admin APIs

### 📊 Dashboards & Analytics
- Animated admin dashboard
- Order lifecycle charts
- User distribution charts
- Count-up KPI statistics
- Premium UI with smooth animations

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Framer Motion
- Axios
- Recharts
- React CountUp

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Razorpay API
- Nodemailer (SMTP)

### Tools
- MongoDB Compass
- Postman / Thunder Client
- Git & GitHub

---

## 📂 Project Structure

trash2trade/
│
├── trash2trade-backend/
│ ├── config/
│ ├── models/
│ ├── routes/
│ ├── middleware/
│ ├── utils/
│ └── server.js
│
├── trash2trade-frontend/
│ ├── src/
│ │ ├── pages/
│ │ ├── components/
│ │ ├── api/
│ │ └── App.jsx
│ └── vite.config.js
│
└── README.md


---

## 🧠 Prerequisites

Make sure you have installed:
- Node.js (v18 or higher recommended)
- MongoDB (Local or MongoDB Atlas)
- Git

---

## ⚙️ Environment Variables

### Backend (`.env`)
Create a `.env` file inside **trash2trade-backend**:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret


Frontend (.env)

Create a .env file inside trash2trade-frontend:
VITE_API_BASE_URL=http://localhost:5000/api

🧩 Installation & Setup
1️⃣ Clone Repository
git clone https://github.com/your-username/trash2trade.git
cd trash2trade

2️⃣ Backend Setup
cd trash2trade-backend
npm install
npm run dev


Backend runs at:

http://localhost:5000

3️⃣ Frontend Setup
cd trash2trade-frontend
npm install
npm run dev


Frontend runs at:

http://localhost:5173

👑 Admin Access

To test admin features:

Register a normal user

Update the user role in MongoDB:

"role": "admin"


Login again to access admin dashboard

Admin abilities:

View all users

Block / Unblock users

Monitor orders

View analytics dashboard

🧪 API Testing

You can test APIs using:

Thunder Client

Postman

Important admin routes:

GET /api/users/admin/all
PUT /api/users/admin/:id/toggle
GET /api/stats/admin

🎨 UI Highlights

Smooth page transitions

Animated stat cards

Button morph animations

Optimistic UI updates

Fast, clean admin experience
