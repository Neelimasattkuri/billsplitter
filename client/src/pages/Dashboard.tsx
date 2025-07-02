"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { DollarSign, FileText, TrendingUp, Users, Plus } from "lucide-react"
import StatCard from "../components/StatCard"
import BillCard from "../components/BillCard"
import ExpenseChart from "../components/ExpenseChart"
import UserShareChart from "../components/UserShareChart"
import { billsAPI } from "../services/api"
import type { Bill } from "../types"

const Dashboard = () => {
  const [bills, setBills] = useState<Bill[]>([])
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [billsResponse, statsResponse] = await Promise.all([billsAPI.getAll({ limit: 6 }), billsAPI.getStats()])

        setBills(billsResponse.data.bills)
        setStats(statsResponse.data)
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-error-500 mb-4">{error}</div>
        <button onClick={() => window.location.reload()} className="btn btn-primary">
          Try Again
        </button>
      </div>
    )
  }

  // Transform monthly expenses data for chart
  const expenseData =
    stats?.monthlyExpenses?.map((item: any) => ({
      month: new Date(item._id.year, item._id.month - 1).toLocaleDateString("en-US", { month: "short" }),
      amount: item.amount,
    })) || []

  // Mock user share data (in real app, calculate from bills)
  const userShareData = [
    { name: "You", amount: stats?.totalAmount * 0.4 || 0, color: "rgba(14, 165, 233, 0.7)" },
    { name: "Others", amount: stats?.totalAmount * 0.6 || 0, color: "rgba(20, 184, 166, 0.7)" },
  ]

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
          value={`$${stats?.totalAmount?.toFixed(2) || "0.00"}`}
          icon={<DollarSign size={20} />}
        />
        <StatCard title="Unpaid Bills" value={stats?.unpaidBills || 0} icon={<FileText size={20} />} />
        <StatCard
          title="Amount Due"
          value={`$${stats?.unpaidAmount?.toFixed(2) || "0.00"}`}
          icon={<TrendingUp size={20} />}
        />
        <StatCard title="Total Bills" value={stats?.totalBills || 0} icon={<Users size={20} />} />
      </div>

      {expenseData.length > 0 && (
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
      )}

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-neutral-800">Recent Bills</h2>
          <Link to="/bills" className="text-sm text-primary-600 hover:text-primary-700">
            View all
          </Link>
        </div>

        {bills.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
              <FileText size={32} className="text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-800">No bills yet</h3>
            <p className="text-neutral-500 mt-1">Create your first bill to get started</p>
            <Link to="/bills/add" className="btn btn-primary mt-4 inline-flex">
              <Plus size={18} />
              <span>Add New Bill</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bills.map((bill) => (
              <BillCard key={bill._id} bill={bill} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
