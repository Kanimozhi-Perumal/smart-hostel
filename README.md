🏫 Smart Hostel Management System

Secure • Real-Time • Role-Based Campus Solution

A full-stack Smart Hostel Management System that digitizes student outpasses, parent approvals, and hostel gate entry/exit using QR codes, OTP verification, and real-time socket updates.

🚀 Key Highlights

🔐 Role-based system (Admin / Student / Parent / Gate)

📄 Digital Outpass Management

👨‍👩‍👧 Parent OTP-based Approval

📱 QR Code Generation & Validation

🚪 Gate Entry / Exit Tracking

🔊 Real-time Gate Alerts with Sound

📡 Socket.IO live updates

🤖 AI Risk Engine (Rule-based)

🧠 AI Risk Engine

A modular rule-based AI system assigns risk levels to outpass requests.

Risk Levels

🟢 LOW

🟡 MEDIUM

🔴 HIGH

Design Features

Easily replaceable with ML models (TensorFlow / PyTorch)

Centralized logic

Transparent decision rules

👥 User Roles & Capabilities
🎓 Student

Apply for outpass

View approval status

Receive QR code after approval

Track ENTRY / EXIT / COMPLETED status

Download QR for gate use

👨‍👩‍👧 Parent

Linked to student account

Receive OTP

Approve outpass securely

QR generated only after approval

🛡️ Admin

Live gate monitoring

View all students & parents

Outpass analytics

Gate alerts with sound

Dashboard charts & reports

🚪 Gate

Scan student QR

Trigger ENTRY / EXIT

Auto-complete outpass

Real-time socket broadcast

Audio alerts for success / failure

🔄 Complete Workflow

Student applies for outpass

AI assigns risk level

Parent receives OTP

Parent verifies OTP & approves

QR code is generated

Student uses QR at gate

Gate scans QR

Status updates:

APPROVED → EXITED → ENTERED → COMPLETED

Admin dashboard updates in real-time

🧰 Tech Stack
Frontend

React.js

Tailwind CSS

Lottie Animations

Socket.IO Client

Backend

Node.js

Express.js

MongoDB (Mongoose)

JWT Authentication

Socket.IO Server

Utilities

QR Code Generator

OTP System

Audio Notifications

📂 Project Structure
smart-hostel/
│
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── assets/lottie/
│   │   └── services/api.js
│
├── server/                 # Node backend
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── utils/
│   └── socket.js
│
├── README.md
└── package.json

⚙️ Installation & Setup
1️⃣ Clone Repository
git clone https://github.com/Kanimozhi-Perumal/smart-hostel.git
cd smart-hostel

2️⃣ Backend Setup
cd server
npm install
npm run dev


Create .env

PORT=5000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key

3️⃣ Frontend Setup
cd client
npm install
npm start

🔌 Socket.IO Setup
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "http://localhost:3000" }
});

app.set("io", io);

io.on("connection", socket => {
  console.log("Gate connected");
});

📸 Screens & Features

Animated login & role selection

Student dashboard with QR & timeline

Parent approval portal with OTP

Admin dashboard with charts

Live gate monitor with sound alerts

🔐 Security Features

JWT Authentication

Role-based access control

OTP expiry

One-time QR generation

Gate validation logic

🧪 Future Enhancements

🤖 ML-based risk prediction

📍 GPS-based gate validation

📊 Advanced analytics dashboard

📱 Mobile app integration

📧 Email / SMS OTP delivery

🏁 Conclusion

This project demonstrates real-world hostel security automation, combining full-stack development, real-time systems, authentication, and AI logic — making it ideal for placements, final-year projects, and demos.
