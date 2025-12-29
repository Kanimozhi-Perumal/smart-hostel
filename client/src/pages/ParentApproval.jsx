import { useState } from "react";
import api from "../services/api";

/* 🎬 LOTTIE */
import Lottie from "lottie-react";
import parentAnim from "../assets/lottie/parent.json";

export default function ParentApproval() {
  const [outpassId, setOutpassId] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");

  const sendOTP = async () => {
    try {
      await api.post("/parent/send-otp", {
        outpassId,
        parentEmail
      });
      setMessage("OTP sent successfully ✅");
    } catch (err) {
      setMessage(err.response?.data?.msg || "Failed to send OTP");
    }
  };

  const verifyOTP = async () => {
    try {
      await api.post("/parent/verify-otp", {
        outpassId,
        otp,
        action: "APPROVE"
      });
      setMessage("Outpass approved & QR generated ✅");
    } catch (err) {
      setMessage(err.response?.data?.msg || "OTP verification failed");
    }
  };

  const stepState = {
    outpass: outpassId ? "done" : "active",
    otp: otp ? "active" : "pending",
    qr: message.includes("QR") ? "done" : "pending"
  };

  return (
    <div className="min-h-screen aurora-bg">

      {/* ---------- HEADER ---------- */}
      <header className="header">
        <span className="font-bold text-lg text-white">Parent Approval</span>
        <span className="text-white/80">Smart Hostel</span>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-10">

        {/* ---------- HERO ---------- */}
        <section className="hero-card">
          <div className="lottie-wrap">
            <Lottie animationData={parentAnim} loop autoplay />
          </div>

          <div>
            <h1 className="text-3xl font-bold text-indigo-700">
              Parent Approval Portal 🔐
            </h1>
            <p className="text-slate-600 mt-2">
              Secure OTP-based approval for student outpass requests
            </p>

            {/* STEPS */}
            <div className="flex flex-wrap gap-3 mt-5">
              {[
                ["Enter Outpass", stepState.outpass],
                ["Verify OTP", stepState.otp],
                ["QR Generated", stepState.qr]
              ].map(([label, state]) => (
                <span
                  key={label}
                  className={`px-4 py-1 rounded-full text-sm font-semibold
                    ${state === "done" && "bg-green-100 text-green-700"}
                    ${state === "active" && "bg-indigo-100 text-indigo-700"}
                    ${state === "pending" && "bg-gray-100 text-gray-500"}
                  `}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- TRUST INFO ---------- */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="white-card text-center">🔒 OTP Protected</div>
          <div className="white-card text-center">🧾 Hostel Verified</div>
          <div className="white-card text-center">🕒 Time-bound QR</div>
        </section>

        {/* ---------- APPROVAL FORM ---------- */}
        <section className="white-card max-w-xl mx-auto relative">

          {message && (
            <div className="mb-5 text-center font-semibold text-indigo-600">
              {message}
            </div>
          )}

          {/* Outpass ID */}
          <div className="mb-4">
            <label className="label">Outpass ID</label>
            <input
              className="input"
              placeholder="Enter Outpass ID"
              value={outpassId}
              onChange={e => setOutpassId(e.target.value)}
            />
          </div>

          {/* Parent Email */}
          <div className="mb-4">
            <label className="label">Parent Email</label>
            <input
              className="input"
              placeholder="parent@gmail.com"
              value={parentEmail}
              onChange={e => setParentEmail(e.target.value)}
            />
          </div>

          {/* Send OTP */}
          <button onClick={sendOTP} className="nav-btn w-full mb-6">
            Send OTP
          </button>

          {/* OTP */}
          <div className="mb-4">
            <label className="label">Enter OTP</label>
            <input
              type="number"
              inputMode="numeric"
              className="input"
              placeholder="Enter OTP"
              value={otp}
              onChange={e => setOtp(e.target.value)}
            />
          </div>

          {/* Approve */}
          <button
            onClick={verifyOTP}
            className="w-full approve-btn bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Approve Outpass
          </button>
        </section>
      </main>

      {/* ---------- FOOTER ---------- */}
      <footer className="footer">
        © {new Date().getFullYear()} Smart Hostel • Secure Campus System
      </footer>

      {/* ================= STYLES ================= */}
      <style>{`
        .aurora-bg {
          background:
            radial-gradient(circle at top left, #22d3ee, transparent 40%),
            radial-gradient(circle at bottom right, #a855f7, transparent 40%),
            linear-gradient(135deg, #4f46e5, #7c3aed);
        }

        .header {
          position: sticky;
          top: 0;
          z-index: 20;
          padding: 18px 32px;
          display: flex;
          justify-content: space-between;
        }

        .hero-card {
          display: flex;
          gap: 32px;
          align-items: center;
          background: white;
          padding: 28px;
          border-radius: 26px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.25);
        }

        .lottie-wrap {
          width: 180px;
        }

        @media (max-width: 768px) {
          .hero-card {
            flex-direction: column;
            text-align: center;
          }
        }

        .white-card {
          background: white;
          padding: 20px;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.18);
        }

        .white-card::before {
          content: "";
          position: absolute;
          inset: -10px;
          background: linear-gradient(135deg, #6366f1, #22d3ee);
          filter: blur(30px);
          z-index: -1;
          opacity: 0.25;
        }

        .label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: #4b5563;
          margin-bottom: 4px;
        }

        .input {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: 1px solid #d1d5db;
          outline: none;
        }

        .input:focus {
          border-color: #6366f1;
          box-shadow: 0 0 0 2px #6366f133;
        }

        .nav-btn {
          padding: 12px;
          border-radius: 999px;
          background: #4f46e5;
          color: white;
          font-weight: 600;
          box-shadow: 0 10px 20px rgba(0,0,0,0.15);
        }

        .footer {
          text-align: center;
          padding: 24px;
          color: white;
          opacity: 0.75;
        }

        @media (max-width: 640px) {
          .approve-btn {
            position: sticky;
            bottom: 12px;
          }
        }
      `}</style>
    </div>
  );
}
