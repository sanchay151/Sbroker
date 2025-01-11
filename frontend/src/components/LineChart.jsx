import React from "react";
import useIsMobile from "./useIsMobile";
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
import annotationPlugin from "chartjs-plugin-annotation"; // Import annotation plugin

// Register Chart.js components and plugins
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin // Register annotation plugin
);

function LineChart({ chartData }) {
  const isMobile=useIsMobile();
  const prices = chartData.data;
  const firstPrice = prices[prices.length - 1]; // First price
  const lastPrice = prices[0]; // Last price

  // Determine line color based on price trend
  let color;
  if (lastPrice <= firstPrice) {
    color = "rgba(10, 187, 146, 1)"; // Green for upward trend
  } else {
    color = "#D5542A"; // Red for downward trend
  }

  // Chart data
  const chardata = {
    labels: chartData.labels, // Array of labels
    datasets: [
      {
        data: chartData.data, // Array of data points
        borderColor: color, // Line color
        borderWidth: 2, // Line thickness
        backgroundColor: "rgba(0, 0, 0, 0)", // No fill
        tension: 0.3, // Smooth curve
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: color,
      },
    ],
  };

  // Chart options
  const charoption = {
    plugins: {
      legend: {
        display: false, // Hide legend
      },
      annotation: {
        annotations: {
          line1: {
            type: "line", // Draw a line
            yMin: lastPrice, // Position at first price
            yMax: lastPrice, // Keep it horizontal
            borderColor: "rgba(128, 128, 128, 1)", // Gray color
            borderWidth: 1, // Thickness
            borderDash: [5, 5], // Dotted line
            label: {
              display: false, // Hide label (optional)
            },
          },
        },
      },
    },
    scales: {
      x: {
        display: false, // Hide X-axis
      },
      y: {
        display: false, // Hide Y-axis
      },
    },
    maintainAspectRatio: false, // Allow size customization
  };

  return (
    <div className={`${isMobile?("h-[333px] w-[375px] mr-24 ml-4"):("h-[500px] w-[600px] mr-20 ml-12")}`}> {/* Larger size */}
      <Line data={chardata} options={charoption} />
    </div>
  );
}

export default LineChart;
