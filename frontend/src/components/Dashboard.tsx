// src/components/Dashboard.tsx
import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  const chartData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Issues Closed",
        data: [12, 19, 3, 5],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
      {
        label: "PRs Merged",
        data: [7, 11, 5, 8],
        borderColor: "rgb(153, 102, 255)",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Team Performance",
      },
    },
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
        Dashboard
      </h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white dark:bg-neutral-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400 truncate">
              Total Issues
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-neutral-900 dark:text-white">
              39
            </dd>
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400 truncate">
              Open PRs
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-neutral-900 dark:text-white">
              12
            </dd>
          </div>
        </div>
        <div className="bg-white dark:bg-neutral-800 overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400 truncate">
              Team Efficiency
            </dt>
            <dd className="mt-1 text-3xl font-semibold text-neutral-900 dark:text-white">
              87%
            </dd>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-neutral-800 shadow rounded-lg p-6">
        <Line options={chartOptions} data={chartData} />
      </div>
    </div>
  );
};

export default Dashboard;
