import { Link } from "react-router-dom"
import { format } from "date-fns"
import type { Bill } from "../types"

interface BillCardProps {
  bill: Bill
}

const BillCard = ({ bill }: BillCardProps) => {
  const isPaid = bill.status === "paid"
  const isOverdue = !isPaid && new Date(bill.dueDate) < new Date()

  return (
    <Link to={`/bills/${bill.id}`} className="block">
      <div className="card hover:border-primary-300 border-2 border-transparent">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-lg text-neutral-800">{bill.title}</h3>
            <p className="text-sm text-neutral-500">
              {bill.description || `Bill for ${format(new Date(bill.date), "MMMM yyyy")}`}
            </p>
          </div>

          <div className={`badge ${isPaid ? "badge-success" : isOverdue ? "badge-error" : "badge-warning"}`}>
            {isPaid ? "Paid" : isOverdue ? "Overdue" : "Pending"}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-2xl font-bold text-primary-700">${bill.amount.toFixed(2)}</p>
          <p className="text-sm text-neutral-500">Due: {format(new Date(bill.dueDate), "MMM d, yyyy")}</p>
        </div>

        <div className="mt-4 flex items-center">
          <div className="flex -space-x-2">
            {bill.users.slice(0, 3).map((user, index) => (
              <div
                key={index}
                className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center border-2 border-white"
              >
                <span className="text-xs font-medium text-primary-700">{user.name.charAt(0)}</span>
              </div>
            ))}

            {bill.users.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center border-2 border-white">
                <span className="text-xs font-medium text-neutral-700">+{bill.users.length - 3}</span>
              </div>
            )}
          </div>

          <div className="ml-3">
            <p className="text-xs text-neutral-500">
              {bill.users.length} {bill.users.length === 1 ? "person" : "people"}
            </p>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default BillCard
