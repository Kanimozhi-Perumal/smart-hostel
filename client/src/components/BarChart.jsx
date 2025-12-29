import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const BarChart = ({ pending, approved, completed }) => {
  const data = {
    labels: ["Pending", "Approved", "Completed"],
    datasets: [
      {
        label: "Outpasses",
        data: [pending, approved, completed],
        backgroundColor: ["#facc15", "#3b82f6", "#22c55e"]
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 5
        }
      }
    }
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
