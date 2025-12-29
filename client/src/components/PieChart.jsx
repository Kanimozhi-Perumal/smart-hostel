import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ students, parents }) => {
  const data = {
    labels: ["Students", "Parents"],
    datasets: [
      {
        data: [students, parents],
        backgroundColor: ["#6366f1", "#22c55e"],
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom"
      }
    }
  };

  return <Pie data={data} options={options} />;
};

export default PieChart;
