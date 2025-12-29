import { useEffect, useRef, useState } from "react";
import api from "../services/api";
import socket from "../socket";

import GateResultCard from "../components/GateResultCard";
import GateLogs from "./GateLogs";
import GateScreen from "../components/GateScreen";

import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from "chart.js";

import { exportExcel } from "../utils/exportExcel";
import { exportPDF } from "../utils/exportPDF";

/* 🎬 LOTTIE */
import Lottie from "lottie-react";
import adminAnim from "../assets/lottie/admin.json";
import studentAnim from "../assets/lottie/student.json";
import parentAnim from "../assets/lottie/parent.json";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

/* ---------------- ROLE → LOTTIE MAP ---------------- */
const roleAnimationMap = {
  admin: adminAnim,
  student: studentAnim,
  parent: parentAnim
};

/* ---------------- STAT CARD ---------------- */
const StatCard = ({ title, value }) => (
  <div className="stat-card">
    <p className="text-sm text-slate-500">{title}</p>
    <p className="text-4xl font-bold text-indigo-700 mt-2">{value}</p>
  </div>
);

/* ================= ADMIN DASHBOARD ================= */
export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [lastGate, setLastGate] = useState(null);
  const [gateAlerts, setGateAlerts] = useState(0);

  const role = localStorage.getItem("role") || "admin";

  const overviewRef = useRef(null);
  const usersRef = useRef(null);
  const outpassRef = useRef(null);
  const todayRef = useRef(null);
  const gateRef = useRef(null);

  const audioRef = useRef(null);

  const fetchSummary = async () => {
    const res = await api.get("/admin/summary");
    setSummary(res.data);
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  /* 🔓 UNLOCK AUDIO */
  useEffect(() => {
    const unlock = () => {
      audioRef.current?.play().catch(() => {});
      window.removeEventListener("click", unlock);
    };
    window.addEventListener("click", unlock);
  }, []);

  /* 🔔 SOCKET */
  useEffect(() => {
    socket.on("gateScan", data => {
      setLastGate(data);
      setGateAlerts(p => p + 1);
      fetchSummary();

      if (!audioRef.current) return;

      if (!data.allowed) audioRef.current.src = "/sounds/error.mp3";
      else if (data.type === "EXIT") audioRef.current.src = "/sounds/exit.mp3";
      else if (data.type === "ENTRY") audioRef.current.src = "/sounds/entry.mp3";
      else audioRef.current.src = "/sounds/notification.mp3";

      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    });

    return () => socket.off("gateScan");
  }, []);

  if (!summary) return <div className="p-10">Loading...</div>;

  /* -------- CHART DATA -------- */
  const usersChart = {
    labels: ["Students", "Parents"],
    datasets: [
      {
        data: [summary.totalStudents, summary.totalParents],
        backgroundColor: ["#60A5FA", "#22C55E"]
      }
    ]
  };

  const outpassChart = {
    labels: ["Pending", "Approved", "Completed"],
    datasets: [
      {
        data: [summary.pending, summary.approved, summary.completed],
        backgroundColor: ["#FACC15", "#6366F1", "#22C55E"]
      }
    ]
  };

  const todayChart = {
    labels: ["Exit Today", "Entry Today"],
    datasets: [
      {
        data: [summary.todayExit || 0, summary.todayEntry || 0],
        backgroundColor: ["#EC4899", "#14B8A6"]
      }
    ]
  };

  const scrollTo = ref =>
    ref.current.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen aurora-bg">

      <audio ref={audioRef} preload="auto" />

      {/* ---------- HEADER ---------- */}
      <header className="header">
        <span className="font-bold text-lg text-white">Admin Dashboard</span>
        <span className="text-white/80">Smart Hostel</span>
      </header>

      {/* ---------- NAV ---------- */}
      <div className="sticky top-[72px] z-10 flex justify-center gap-3 py-4">
        {[
          ["Overview", overviewRef],
          ["Users", usersRef],
          ["Outpasses", outpassRef],
          ["Today", todayRef],
          ["Gate", gateRef]
        ].map(([label, ref]) => (
          <button
            key={label}
            onClick={() => {
              scrollTo(ref);
              if (label === "Gate") setGateAlerts(0);
            }}
            className="nav-btn"
          >
            {label}
            {label === "Gate" && gateAlerts > 0 && (
              <span className="ml-2 bg-red-600 text-white text-xs px-2 rounded-full">
                {gateAlerts}
              </span>
            )}
          </button>
        ))}
      </div>

      <main className="max-w-6xl mx-auto px-6 py-12 space-y-16">

        {/* 🛡️ HERO */}
        <section className="hero-card">
          <div className="lottie-wrap">
            <Lottie
              animationData={roleAnimationMap[role]}
              loop
              autoplay
              style={{
                filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.25))"
              }}
            />
          </div>

          <div>
            <h1 className="text-4xl font-bold text-indigo-700">
              Welcome, {role.toUpperCase()} 👋
            </h1>
            <p className="text-slate-600 mt-2">
              Real-time hostel security & gate monitoring dashboard
            </p>
          </div>
        </section>

        {/* ---------- OVERVIEW ---------- */}
        <section ref={overviewRef}>
          <div className="flex gap-4 mb-6">
            <button onClick={() => exportExcel(summary)} className="nav-btn">
              Export Excel
            </button>
            <button onClick={() => exportPDF(summary)} className="nav-btn">
              Export PDF
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Students" value={summary.totalStudents} />
            <StatCard title="Parents" value={summary.totalParents} />
            <StatCard title="Total Outpasses" value={summary.totalOutpasses} />
            <StatCard title="Pending Requests" value={summary.pending} />
          </div>
        </section>

        {/* ---------- USERS ---------- */}
        <section ref={usersRef} className="white-card">
          <h2 className="section-title">Users Distribution</h2>
          <div className="chart-box">
            <Pie data={usersChart} />
          </div>
        </section>

        {/* ---------- GATE ---------- */}
        <section ref={gateRef} className="white-card">
          <h2 className="section-title">Live Gate Monitor</h2>
          <GateScreen compact />
        </section>

        {lastGate && (
          <section className="white-card">
            <h2 className="section-title">Latest Gate Activity</h2>
            <GateResultCard {...lastGate} />
          </section>
        )}

        <section ref={outpassRef} className="white-card">
          <h2 className="section-title">Outpass Status</h2>
          <Bar data={outpassChart} />
        </section>

        <section ref={todayRef} className="white-card">
          <h2 className="section-title">Today Entry / Exit</h2>
          <Bar data={todayChart} />
        </section>

        <GateLogs />
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
          padding: 20px 32px;
          display: flex;
          justify-content: space-between;
        }

        .hero-card {
          display: flex;
          gap: 40px;
          align-items: center;
          background: white;
          padding: 40px;
          border-radius: 28px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.25);
        }

        /* 🔥 BIG LOTTIE SIZE */
        .lottie-wrap {
          width: 300px;
        }

        @media (max-width: 768px) {
          .hero-card {
            flex-direction: column;
            text-align: center;
          }
          .lottie-wrap {
            width: 240px;
          }
        }

        .stat-card {
          background: white;
          padding: 24px;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.15);
        }

        .white-card {
          background: white;
          padding: 28px;
          border-radius: 22px;
          box-shadow: 0 25px 50px rgba(0,0,0,0.18);
        }

        .nav-btn {
          padding: 10px 18px;
          border-radius: 999px;
          background: white;
          color: #4f46e5;
          font-weight: 600;
          box-shadow: 0 10px 20px rgba(0,0,0,0.15);
          transition: transform 0.2s;
        }

        .nav-btn:hover {
          transform: translateY(-2px);
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 16px;
          color: #4f46e5;
        }

        .chart-box {
          width: 320px;
          height: 320px;
          margin: auto;
        }

        .footer {
          text-align: center;
          padding: 24px;
          color: white;
          opacity: 0.75;
        }
      `}</style>
    </div>
  );
}
