import { useEffect, useRef, useState } from "react";
import socket from "../socket";

export default function GateScreen({ compact = false }) {
  const [scan, setScan] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(false);

  /* 🔊 Audio refs */
  const entryAudio = useRef(null);
  const exitAudio = useRef(null);
  const errorAudio = useRef(null);
  const notifyAudio = useRef(null);

  /* -------------------------------------------------
     🔓 UNLOCK AUDIO (Required by browser)
     ------------------------------------------------- */
  useEffect(() => {
    const unlockAudio = () => {
      [entryAudio, exitAudio, errorAudio, notifyAudio].forEach(ref => {
        if (ref.current) {
          ref.current
            .play()
            .then(() => {
              ref.current.pause();
              ref.current.currentTime = 0;
            })
            .catch(() => {});
        }
      });

      setAudioEnabled(true);
      window.removeEventListener("click", unlockAudio);
      console.log("🔓 Gate audio unlocked");
    };

    window.addEventListener("click", unlockAudio);
    return () => window.removeEventListener("click", unlockAudio);
  }, []);

  /* -------------------------------------------------
     🔔 SOCKET LISTENER
     ------------------------------------------------- */
  useEffect(() => {
    socket.on("gateScan", data => {
      setScan(data);

      if (!audioEnabled) return;

      // ❌ DENIED
      if (!data.allowed) {
        errorAudio.current.currentTime = 0;
        errorAudio.current.play().catch(() => {});
        return;
      }

      // 🔔 NOTIFY
      notifyAudio.current.currentTime = 0;
      notifyAudio.current.play().catch(() => {});

      // 🚪 ENTRY / EXIT
      if (data.type === "ENTRY") {
        entryAudio.current.currentTime = 0;
        entryAudio.current.play().catch(() => {});
      }

      if (data.type === "EXIT") {
        exitAudio.current.currentTime = 0;
        exitAudio.current.play().catch(() => {});
      }
    });

    return () => socket.off("gateScan");
  }, [audioEnabled]);

  /* -------------------------------------------------
     🖥️ WAITING STATE
     ------------------------------------------------- */
  if (!scan) {
    return (
      <div
        className={`flex flex-col items-center justify-center
          ${compact ? "h-[300px]" : "h-screen w-screen"}
          bg-slate-900 text-white rounded-xl cursor-pointer`}
      >
        {/* 🔊 Audio tags (DO NOT REMOVE) */}
        <audio ref={entryAudio} src="/sounds/entry.mp3" preload="auto" />
        <audio ref={exitAudio} src="/sounds/exit.mp3" preload="auto" />
        <audio ref={errorAudio} src="/sounds/error.mp3" preload="auto" />
        <audio ref={notifyAudio} src="/sounds/notification.mp3" preload="auto" />

        <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse mb-4" />
        <h2 className="text-xl font-semibold">
          Waiting for Gate Scan...
        </h2>
        <p className="text-sm text-gray-400">
          Click once to enable sound
        </p>
      </div>
    );
  }

  /* -------------------------------------------------
     ✅ RESULT STATE
     ------------------------------------------------- */
  return (
    <div
      className={`flex flex-col items-center justify-center
        ${compact ? "h-[300px]" : "h-screen w-screen"}
        ${scan.allowed ? "bg-green-700" : "bg-red-700"}
        text-white rounded-xl transition-all duration-300`}
    >
      {/* 🔊 Audio tags */}
      <audio ref={entryAudio} src="/sounds/entry.mp3" preload="auto" />
      <audio ref={exitAudio} src="/sounds/exit.mp3" preload="auto" />
      <audio ref={errorAudio} src="/sounds/error.mp3" preload="auto" />
      <audio ref={notifyAudio} src="/sounds/notification.mp3" preload="auto" />

      <h1 className="text-4xl font-extrabold">
        {scan.allowed ? "ACCESS GRANTED" : "ACCESS DENIED"}
      </h1>

      <p className="mt-2 text-lg font-semibold">{scan.type}</p>
      <p className="mt-2">{scan.studentName}</p>
      <p className="text-sm">{scan.registerNo}</p>
      <p className="italic text-sm mt-1">{scan.reason}</p>
    </div>
  );
}
