import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaUserShield,
  FaUserGraduate,
  FaUsers
} from "react-icons/fa";
import API from "../services/api";
import Lottie from "lottie-react";
import welcomeAnim from "../assets/lottie/hostel-secure.json";

export default function Login() {
  const [stage, setStage] = useState("welcome"); // welcome | role | login
  const [roleSelected, setRoleSelected] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  /* 🔐 LOGIN LOGIC — UNCHANGED */
  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      if (res.data.user.role === "student") navigate("/student");
      else if (res.data.user.role === "parent") navigate("/parent");
      else navigate("/admin");
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen aurora-bg relative overflow-hidden">

      {/* 🌌 Floating particles */}
      <div className="particles" />

      {/* 🔝 HEADER */}
      <header className="relative z-10 flex justify-between items-center px-8 py-5 text-white">
        <h1 className="text-xl font-bold tracking-wide">Smart Hostel</h1>
        <span className="text-sm opacity-80">
          Secure Campus Management System
        </span>
      </header>

      {/* 🧠 MAIN */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 py-12 text-center">

        {/* 🌟 WELCOME STAGE */}
        {stage === "welcome" && (
          <div className="animate-hero max-w-3xl flex flex-col items-center">

            {/* 🎬 LOTTIE */}
            <div className="w-80 mb-6">
              <Lottie animationData={welcomeAnim} loop autoplay />
            </div>

            <h2 className="text-5xl font-extrabold text-white mb-4">
              Welcome to Smart Hostel
            </h2>
            <p className="text-white/80 text-lg mb-10">
              Real-time • Role-based • Secure hostel management system
            </p>

            <button
              onClick={() => setStage("role")}
              className="px-12 py-4 bg-white text-indigo-700 rounded-full font-bold hover:scale-105 transition"
            >
              Get Started →
            </button>
          </div>
        )}

        {/* 🧱 ROLE SELECTION */}
        {stage === "role" && (
          <div className="glass-card animate-fadeIn">
            <h3 className="text-white text-xl font-semibold mb-6">
              Choose Your Role
            </h3>

            <div className="grid grid-cols-3 gap-5">
              <RoleCard
                icon={<FaUserShield />}
                label="Admin"
                onClick={() => {
                  setRoleSelected("admin");
                  setStage("login");
                }}
              />
              <RoleCard
                icon={<FaUserGraduate />}
                label="Student"
                onClick={() => {
                  setRoleSelected("student");
                  setStage("login");
                }}
              />
              <RoleCard
                icon={<FaUsers />}
                label="Parent"
                onClick={() => {
                  setRoleSelected("parent");
                  setStage("login");
                }}
              />
            </div>
          </div>
        )}

        {/* 🔐 LOGIN */}
        {stage === "login" && (
          <div className="login-card animate-slideUp">
            <h3 className="text-2xl font-bold capitalize mb-1">
              {roleSelected} Login
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Secure access portal
            </p>

            {error && (
              <p className="text-red-500 text-sm mb-4">{error}</p>
            )}

            <input
              className="w-full px-4 py-3 border rounded-lg mb-4"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <div className="relative mb-6">
              <input
                type={showPwd ? "text" : "password"}
                className="w-full px-4 py-3 border rounded-lg"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-3 text-gray-500"
              >
                {showPwd ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Login
            </button>

            <button
              onClick={() => setStage("role")}
              className="text-sm text-gray-400 mt-4"
            >
              ← Change role
            </button>
          </div>
        )}
      </main>

      {/* 🔻 FOOTER */}
      <footer className="relative z-10 text-center text-white/60 text-xs py-6">
        © {new Date().getFullYear()} Smart Hostel • Built with MERN Stack
      </footer>

      {/* 🎨 STYLES */}
      <style>{`
        .aurora-bg {
          background: radial-gradient(circle at top left, #22d3ee, transparent 40%),
                      radial-gradient(circle at bottom right, #a855f7, transparent 40%),
                      linear-gradient(135deg, #4f46e5, #7c3aed);
        }

        .particles::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px);
          background-size: 40px 40px;
          animation: drift 20s linear infinite;
        }

        @keyframes drift {
          from { background-position: 0 0; }
          to { background-position: 120px 200px; }
        }

        .glass-card {
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(16px);
          border-radius: 1.75rem;
          padding: 2rem;
          box-shadow: 0 30px 60px rgba(0,0,0,0.3);
        }

        .login-card {
          background: white;
          border-radius: 1.75rem;
          padding: 2rem;
          width: 100%;
          max-width: 380px;
          box-shadow: 0 30px 70px rgba(0,0,0,0.3);
        }

        .animate-hero {
          animation: heroFade 0.8s ease forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease forwards;
        }

        .animate-slideUp {
          animation: slideUp 0.6s ease forwards;
        }

        @keyframes heroFade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* 🧱 ROLE CARD */
const RoleCard = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center gap-2 bg-white/25 hover:bg-white/35 rounded-xl py-5 text-white transition hover:scale-105"
  >
    <div className="text-2xl">{icon}</div>
    <span className="font-semibold">{label}</span>
  </button>
);
