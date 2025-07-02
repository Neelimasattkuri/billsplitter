"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { DollarSign, FileText, TrendingUp, Users, Plus } from "lucide-react"
import StatCard from "../components/StatCard"
import BillCard from "../components/BillCard"
import ExpenseChart from "../components/ExpenseChart"
import UserShareChart from "../components/UserShareChart"
import type { Bill } from "../types"
import { mockBills, mockUsers } from "../data/mockData"

const Dashboard = () => {
  const [bills, setBills] = useState<Bill[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBills(mockBills)
      setIsLoading(false)
    }, 500)
  }, [])

  const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0)
  const unpaidBills = bills.filter((bill) => bill.status === "pending")
  const unpaidAmount = unpaidBills.reduce((sum, bill) => sum + bill.amount, 0)

  // Data for expense chart
  const expenseData = [
    { month: "Jan", amount: 120 },
    { month: "Feb", amount: 150 },
    { month: "Mar", amount: 180 },
    { month: "Apr", amount: 170 },
    { month: "May", amount: 190 },
    { month: "Jun", amount: 210 },
  ]

  // Data for user share chart
  const userShareData = mockUsers.map((user, index) => {
    const colors = [
      "rgba(14, 165, 233, 0.7)",
      "rgba(20, 184, 166, 0.7)",
      "rgba(217, 70, 239, 0.7)",
      "rgba(245, 158, 11, 0.7)",
    ]

    return {
      name: user.name,
      amount: Math.floor(Math.random() * 100) + 50,
      color: colors[index % colors.length],
    }
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-800">Dashboard</h1>
        <Link to="/bills/add" className="btn btn-primary">
          <Plus size={18} />
          <span>Add New Bill</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Bills"
          value={`$${totalAmount.toFixed(2)}`}
          icon={<DollarSign size={20} />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Unpaid Bills"
          value={unpaidBills.length}
          icon={<FileText size={20} />}
          trend={{ value: 5, isPositive: false }}
        />
        <StatCard title="Amount Due" value={`$${unpaidAmount.toFixed(2)}`} icon={<TrendingUp size={20} />} />
        <StatCard title="Active Users" value={mockUsers.length} icon={<Users size={20} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">Monthly Expenses</h2>
          <ExpenseChart data={expenseData} />
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-neutral-800 mb-4">Expense Distribution</h2>
          <UserShareChart data={userShareData} />
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-neutral-800">Recent Bills</h2>
          <Link to="/bills" className="text-sm text-primary-600 hover:text-primary-700">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bills.slice(0, 3).map((bill) => (
            <BillCard key={bill.id} bill={bill} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
