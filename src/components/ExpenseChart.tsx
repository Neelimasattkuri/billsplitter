import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
  type ChartOptions,
} from "chart.js"
import { Bar } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface ExpenseChartProps {
  data: {
    month: string
    amount: number
  }[]
}

const ExpenseChart = ({ data }: ExpenseChartProps) => {
  const chartData: ChartData<"bar"> = {
    labels: data.map((item) => item.month),
    datasets: [
      {
        label: "Expenses",
        data: data.map((item) => item.amount),
        backgroundColor: "rgba(14, 165, 233, 0.7)",
        borderColor: "rgba(14, 165, 233, 1)",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  }

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `$${context.parsed.y.toFixed(2)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => "$" + value,
        },
      },
    },
  }

  return (
    <div className="h-64">
      <Bar data={chartData} options={options} />
    </div>
  )
}

export default ExpenseChart
