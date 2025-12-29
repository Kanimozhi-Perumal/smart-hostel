const StatCard = ({ title, value, color }) => {
  const colorMap = {
    indigo: "bg-indigo-100 text-indigo-700",
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
    yellow: "bg-yellow-100 text-yellow-700"
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
      <span
        className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${colorMap[color]}`}
      >
        {title}
      </span>

      <div className="mt-4 text-4xl font-bold text-gray-800">
        {value ?? 0}
      </div>
    </div>
  );
};

export default StatCard;
