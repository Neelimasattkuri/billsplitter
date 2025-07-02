import type { ReactNode } from "react"

interface StatCardProps {
  title: string
  value: string | number
  icon?: ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
}

const StatCard = ({ title, value, icon, trend }: StatCardProps) => {
  return (
    <div className="card">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-neutral-500">{title}</p>
          <p className="mt-1 text-2xl font-semibold text-neutral-800">{value}</p>

          {trend && (
            <div className="mt-1 flex items-center">
              <span className={`text-xs font-medium ${trend.isPositive ? "text-success-700" : "text-error-700"}`}>
                {trend.isPositive ? "+" : "-"}
                {Math.abs(trend.value)}%
              </span>
              <span className="ml-1 text-xs text-neutral-500">from last month</span>
            </div>
          )}
        </div>

        {icon && <div className="p-2 rounded-lg bg-primary-50 text-primary-600">{icon}</div>}
      </div>
    </div>
  )
}

export default StatCard
