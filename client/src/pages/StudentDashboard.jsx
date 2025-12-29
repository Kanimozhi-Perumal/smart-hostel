import { useEffect, useState } from "react";
import api from "../services/api";
import QRDisplay from "../components/QRDisplay";

/* 🎬 LOTTIE */
import Lottie from "lottie-react";
import studentAnim from "../assets/lottie/student.json";

import {
  FaCalendarAlt,
  FaInfoCircle,
  FaClock
} from "react-icons/fa";

/* ================= COUNTDOWN HOOK ================= */
const useCountdown = (toDate) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!toDate) return;

    const update = () => {
      const diff = new Date(toDate) - new Date();
      if (diff <= 0) return setTimeLeft("Expired");

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff / (1000 * 60)) % 60);
      setTimeLeft(`${h}h ${m}m`);
    };

    update();
    const t = setInterval(update, 60000);
    return () => clearInterval(t);
  }, [toDate]);

  return timeLeft;
};

/* ================= UI HELPERS ================= */
const RiskBadge = ({ level = "LOW" }) => (
  <span className="risk-badge">{level} RISK</span>
);

const ProgressTimeline = ({ status }) => {
  const steps = ["REQUESTED", "APPROVED", "EXIT", "ENTRY", "COMPLETED"];
  const index =
    { PENDING: 0, APPROVED: 1, EXITED: 2, ENTERED: 3, COMPLETED: 4 }[status] ?? 0;

  return (
    <div className="flex justify-between mt-4">
      {steps.map((s, i) => (
        <div key={s} className="flex-1 text-center">
          <div
            className={`mx-auto w-7 h-7 rounded-full text-xs flex items-center justify-center
              ${i <= index ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-400"}`}
          >
            {i + 1}
          </div>
          <p className="text-[11px] mt-1 text-slate-500">{s}</p>
        </div>
      ))}
    </div>
  );
};

/* ================= OUTPASS CARD ================= */
const OutpassCard = ({ o }) => {
  const countdown = useCountdown(o?.toDate);
  if (!o) return null;

  const expired = new Date(o.toDate) < new Date();
  const canShowQR =
    ["APPROVED", "EXITED"].includes(o.status) && !expired && o.qrCode;

  return (
    <div className="white-card p-6">
      <div className="flex justify-between items-center">
        <RiskBadge level={o.riskLevel} />
        {expired && <span className="expired-badge">⛔ Expired</span>}
      </div>

      <p className="flex gap-2 mt-3 text-sm text-slate-600">
        <FaInfoCircle /> {o.reason}
      </p>

      <p className="flex gap-2 text-sm mt-2 text-slate-500">
        <FaCalendarAlt /> From: {new Date(o.fromDate).toDateString()}
      </p>

      <p className="flex gap-2 text-sm text-slate-500">
        <FaCalendarAlt /> To: {new Date(o.toDate).toDateString()}
      </p>

      {!expired && canShowQR && (
        <p className="flex gap-2 mt-2 text-indigo-600 text-sm">
          <FaClock /> Expires in: {countdown}
        </p>
      )}

      <ProgressTimeline status={o.status} />

      {canShowQR && (
        <div className="mt-6 border-t pt-4">
          <QRDisplay qrCode={o.qrCode} />
        </div>
      )}
    </div>
  );
};

/* ================= MAIN ================= */
export default function StudentDashboard() {
  const [outpasses, setOutpasses] = useState([]);

  /* 🔔 APPLY OUTPASS STATES */
  const [showForm, setShowForm] = useState(false);
  const [reason, setReason] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  /* 🔥 AUTO-REFRESH EVERY 10 SECONDS */
  useEffect(() => {
    const fetchOutpasses = async () => {
      const res = await api.get("/outpass/my");
      setOutpasses(
        res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
    };

    fetchOutpasses();
    const interval = setInterval(fetchOutpasses, 10000);

    return () => clearInterval(interval);
  }, []);

  /* 🔔 APPLY OUTPASS LOGIC */
  const applyOutpass = async () => {
    if (!reason || !fromDate || !toDate) {
      alert("All fields required");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/outpass", { reason, fromDate, toDate });

      const res = await api.get("/outpass/my");
      setOutpasses(
        res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );

      setReason("");
      setFromDate("");
      setToDate("");
      setShowForm(false);
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to apply outpass");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen aurora-bg">

      {/* ---------- HEADER ---------- */}
      <header className="header">
        <h1 className="text-lg font-bold text-white">Student Dashboard</h1>
        <span className="text-white/80">Smart Hostel</span>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">

        {/* 🎬 HERO */}
        <section className="hero-card">
          <div className="lottie-wrap">
            <Lottie animationData={studentAnim} loop autoplay />
          </div>
          <div>
            <h2 className="text-4xl font-extrabold text-indigo-700">
             Hello Student 👋
             

            </h2>
            <p className="text-slate-600 mt-2">
              Track and apply for hostel outpasses securely.
              Apply for outpass, track approvals, and access your QR instantly.
              Powered by Smart Hostel System


            </p>
          </div>
        </section>

        {/* 🔔 APPLY OUTPASS */}
        <section className="mb-12">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-white text-indigo-700 px-6 py-3 rounded-xl font-semibold shadow hover:scale-105 transition"
          >
            {showForm ? "✖ Cancel" : "➕ Apply for Outpass"}
          </button>

          {showForm && (
            <div className="bg-white mt-6 p-6 rounded-2xl shadow-xl max-w-xl animate-fadeIn">
              <h3 className="text-xl font-bold mb-4 text-indigo-700">
                New Outpass Request
              </h3>

              <input
                className="w-full mb-4 px-4 py-3 border rounded-lg"
                placeholder="Reason (Medical / Home / Personal)"
                value={reason}
                onChange={e => setReason(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="date"
                  className="px-4 py-3 border rounded-lg"
                  value={fromDate}
                  onChange={e => setFromDate(e.target.value)}
                />
                <input
                  type="date"
                  className="px-4 py-3 border rounded-lg"
                  value={toDate}
                  onChange={e => setToDate(e.target.value)}
                />
              </div>

              <button
                onClick={applyOutpass}
                disabled={submitting}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
              >
                {submitting ? "Submitting..." : "Submit Outpass Request"}
              </button>
            </div>
          )}
        </section>

        {/* REQUESTS */}
        <h3 className="section-title">Your Outpass Requests</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {outpasses.map(o => (
            <OutpassCard key={o._id} o={o} />
          ))}
        </div>
      </main>

      {/* ---------- FOOTER ---------- */}
      <footer className="footer">
        © {new Date().getFullYear()} Smart Hostel • Secure Campus System
      </footer>

      {/* ================= STYLES ================= */}
      <style>{`
        .aurora-bg {
          background:
            radial-gradient(circle at top left, #38bdf8, transparent 40%),
            radial-gradient(circle at bottom right, #818cf8, transparent 40%),
            linear-gradient(135deg, #4f46e5, #7c3aed);
        }

        .header {
          display: flex;
          justify-content: space-between;
          padding: 18px 32px;
        }

        .hero-card {
          display: flex;
          gap: 36px;
          background: white;
          padding: 40px;
          border-radius: 28px;
          margin-bottom: 40px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.2);
        }

        .lottie-wrap { width: 260px; }

        .white-card {
          background: white;
          border-radius: 22px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }

        .risk-badge {
          background: #dcfce7;
          color: #166534;
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
        }

        .expired-badge {
          background: #fee2e2;
          color: #991b1b;
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 12px;
        }

        .section-title {
          font-size: 1.6rem;
          font-weight: 700;
          color: white;
          margin-bottom: 24px;
        }

        .footer {
          text-align: center;
          padding: 24px;
          color: white;
          opacity: 0.75;
        }

        .animate-fadeIn {
          animation: fadeUp 0.5s ease forwards;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
