import { useEffect, useState } from "react";
import api from "../services/api";

export default function GateLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/gate/logs/my") // ✅ CORRECT ROUTE
      .then(res => {
        // latest first
        const sorted = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setLogs(sorted);
      })
      .catch(err => {
        console.error("Failed to load gate logs", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-10">
      <h2 className="text-xl font-semibold mb-4">Gate Logs</h2>

      {/* LOADING */}
      {loading && <p>Loading logs...</p>}

      {/* EMPTY STATE */}
      {!loading && logs.length === 0 && (
        <p className="text-gray-500">No gate activity yet.</p>
      )}

      {/* LOG TABLE */}
      {!loading && logs.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left text-sm">
                <th className="p-3">Student</th>
                <th className="p-3">Reg No</th>
                <th className="p-3">Action</th>
                <th className="p-3">Status</th>
                <th className="p-3">Reason</th>
                <th className="p-3">Time</th>
              </tr>
            </thead>

            <tbody>
              {logs.map(log => (
                <tr
                  key={log._id}
                  className="border-b hover:bg-gray-50 text-sm"
                >
                  <td className="p-3 font-medium">
                    {log.studentName}
                  </td>

                  <td className="p-3">
                    {log.registerNo}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${
                          log.action === "EXIT"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                    >
                      {log.action}
                    </span>
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold
                        ${
                          log.allowed
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                    >
                      {log.allowed ? "ALLOWED" : "DENIED"}
                    </span>
                  </td>

                  <td className="p-3">
                    {log.reason || "-"}
                  </td>

                  <td className="p-3 text-gray-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
