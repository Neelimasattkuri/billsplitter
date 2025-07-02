import { Chart as ChartJS, ArcElement, Tooltip, Legend, type ChartData, type ChartOptions } from "chart.js"
import { Doughnut } from "react-chartjs-2"

ChartJS.register(ArcElement, Tooltip, Legend)

interface UserShareChartProps {
  data: {
    name: string
    amount: number
    color: string
  }[]
}

const UserShareChart = ({ data }: UserShareChartProps) => {
  const chartData: ChartData<"doughnut"> = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        data: data.map((item) => item.amount),
        backgroundColor: data.map((item) => item.color),
        borderColor: data.map((item) => item.color),
        borderWidth: 1,
      },
    ],
  }

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || ""
            const value = context.parsed || 0
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
            const percentage = Math.round((value / total) * 100)
            return `${label}: $${value.toFixed(2)} (${percentage}%)`
          },
        },
      },
    },
    cutout: "70%",
  }

  return (
    <div className="h-64">
      <Doughnut data={chartData} options={options} />
    </div>
  )
}

export default UserShareChart
