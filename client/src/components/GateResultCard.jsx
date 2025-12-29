export default function GateResultCard({
  allowed,
  action,
  name,
  regNo,
  reason
}) {
  return (
    <div
      className={`rounded-xl p-6 text-white text-center shadow-lg ${
        allowed ? "bg-green-600" : "bg-red-600"
      }`}
    >
      <h2 className="text-3xl font-extrabold tracking-wide">
        {allowed ? "ACCESS GRANTED" : "ACCESS DENIED"}
      </h2>

      <p className="text-lg mt-2 uppercase">{action}</p>

      <div className="mt-4 space-y-1 text-sm opacity-90">
        <p className="font-semibold">{name}</p>
        <p>{regNo || "N/A"}</p>
        <p className="italic">{reason}</p>
      </div>
    </div>
  );
}
