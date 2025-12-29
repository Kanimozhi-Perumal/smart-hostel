import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* -------- Pages -------- */
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import ParentApproval from "./pages/ParentApproval";
import AdminDashboard from "./pages/AdminDashboard";
import GateScreen from "./components/GateScreen";
import GateLogs from "./pages/GateLogs";

/* -------- PRIVATE ROUTE -------- */
const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/" />;
  if (role && role !== userRole) return <Navigate to="/" />;

  return children;
};

/* -------- APP ROUTER -------- */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ---------- PUBLIC ROUTES ---------- */}
        <Route path="/" element={<Login />} />
        <Route path="/gate" element={<GateScreen />} /> {/* Gate TV / Monitor */}

        {/* ---------- STUDENT ---------- */}
        <Route
          path="/student"
          element={
            <PrivateRoute role="student">
              <StudentDashboard />
            </PrivateRoute>
          }
        />

        {/* ---------- PARENT ---------- */}
        <Route
          path="/parent"
          element={
            <PrivateRoute role="parent">
              <ParentApproval />
            </PrivateRoute>
          }
        />

        {/* ---------- ADMIN ---------- */}
        <Route
          path="/admin"
          element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/gate-logs"
          element={
            <PrivateRoute role="admin">
              <GateLogs />
            </PrivateRoute>
          }
        />

        {/* ---------- FALLBACK ---------- */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}
