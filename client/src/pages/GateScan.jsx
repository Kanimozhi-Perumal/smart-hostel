import { useEffect, useRef, useState } from "react";
import socket from "../socket";
import api from "../services/api";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function GateSystem() {
  /* ---------------- STATES ---------------- */
  const [scan, setScan] = useState(null);       // live socket scan result
  const [outpassId, setOutpassId] = useState(""); // manual scan
  const [message, setMessage] = useState("");

  const audioRef = useRef(null);

  /* ---------------- 🔓 UNLOCK AUDIO ---------------- */
  useEffect(() => {
    const unlock = () => {
      audioRef.current?.play().catch(() => {});
      window.removeEventListener("click", unlock);
    };

    window.addEventListener("click", unlock);
  }, []);

  /* ---------------- 🔔 SOCKET LISTENER ---------------- */
  useEffect(() => {
    socket.on("gateScan", data => {
      setScan(data);

      // 🔊 Play sound
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }

      // ⏱ Auto clear after 4s
      setTimeout(() => setScan(null), 4000);
    });

    return () => socket.off("gateScan");
  }, []);

  /* ---------------- 🧪 MANUAL GATE SCAN ---------------- */
  const scanGate = async (action) => {
    try {
      const res = await api.post("/gate/scan", {
        outpassId,
        action
      });

      setMessage(res.data.msg);
      setOutpassId("");
    } catch (err) {
      setMessage(err.response?.data?.msg || "Scan failed");
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-900 text-white flex">

      {/* 🔊 AUDIO ELEMENT (ONCE) */}
      <audio ref={audioRef} src="/sounds/notification.mp3" preload="auto" />

      {/* ================= LEFT: GATE SCREEN ================= */}
      <div className="flex-1 flex items-center justify-center">

        {/* DEFAULT SCREEN */}
        {!scan && (
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">📟 Gate Scanner</h1>
            <p className="text-xl text-gray-300">Scan QR to proceed</p>
          </div>
        )}

        {/* SCAN RESULT */}
        {scan && (
          <div className="bg-gray-800 rounded-2xl p-12 text-center w-[90%] max-w-2xl">

            {/* STATUS ICON */}
            {scan.allowed ? (
              <FaCheckCircle className="text-green-400 text-7xl mx-auto mb-4" />
            ) : (
              <FaTimesCircle className="text-red-500 text-7xl mx-auto mb-4" />
            )}

            <h1
              className={`text-5xl font-bold ${
                scan.allowed ? "text-green-400" : "text-red-500"
              }`}
            >
              {scan.allowed ? "ACCESS GRANTED" : "ACCESS DENIED"}
            </h1>

            <p className="text-2xl mt-4">
              {scan.type === "EXIT" ? "🚪 EXIT" : "🏠 ENTRY"}
            </p>

            {/* STUDENT DETAILS */}
            <div className="mt-6 text-lg text-gray-300">
              <p><b>Name:</b> {scan.studentName}</p>
              <p><b>Register No:</b> {scan.registerNo}</p>
              <p><b>Reason:</b> {scan.reason}</p>
            </div>

            {/* TIME */}
            <p className="mt-4 text-sm text-gray-400">
              {new Date().toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {/* ================= RIGHT: MANUAL GATE SCAN ================= */}
      <div className="w-[400px] bg-gray-800 p-8 border-l border-gray-700">
        <h2 className="text-2xl font-bold mb-6">🧪 Manual Gate Scan</h2>

        <input
          className="w-full p-3 rounded bg-gray-700 text-white outline-none"
          placeholder="Scan / Paste Outpass ID"
          value={outpassId}
          onChange={(e) => setOutpassId(e.target.value)}
        />

        <div className="flex gap-4 mt-6">
          <button
            onClick={() => scanGate("EXIT")}
            className="flex-1 py-3 bg-red-600 rounded hover:bg-red-700 font-semibold"
          >
            EXIT
          </button>

          <button
            onClick={() => scanGate("ENTRY")}
            className="flex-1 py-3 bg-green-600 rounded hover:bg-green-700 font-semibold"
          >
            ENTRY
          </button>
        </div>

        {message && (
          <p className="mt-6 text-center text-lg font-semibold text-yellow-400">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
