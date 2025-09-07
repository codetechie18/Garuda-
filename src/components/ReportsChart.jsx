import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const ReportsChart = () => {
  const pieData = {
    labels: ['Resolved', 'Active', 'New', 'Pending'],
    datasets: [
      {
        data: [156, 18, 42, 8],
        backgroundColor: [
          'hsl(142, 76%, 36%)',
          'hsl(48, 96%, 53%)', 
          'hsl(204, 100%, 50%)',
          'hsl(0, 84%, 60%)'
        ],
        borderColor: [
          'hsl(142, 76%, 36%)',
          'hsl(48, 96%, 53%)',
          'hsl(204, 100%, 50%)', 
          'hsl(0, 84%, 60%)'
        ],
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          usePointStyle: true,
          color: 'hsl(215, 25%, 12%)',
          font: {
            size: 12,
            weight: '500'
          }
        },
      },
      tooltip: {
        backgroundColor: 'hsl(220, 20%, 99%)',
        titleColor: 'hsl(215, 25%, 12%)',
        bodyColor: 'hsl(215, 25%, 12%)',
        borderColor: 'hsl(215, 15%, 85%)',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed * 100) / total).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      },
    },
  };

  return (
    <div className="h-64 w-full">
      <Pie data={pieData} options={pieOptions} />
    </div>
  );
};

export default ReportsChart;