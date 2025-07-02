"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Plus, Search, Filter, FileText } from "lucide-react"
import BillCard from "../components/BillCard"
import type { Bill } from "../types"
import { mockBills } from "../data/mockData"

const Bills = () => {
  const [bills, setBills] = useState<Bill[]>([])
  const [filteredBills, setFilteredBills] = useState<Bill[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "paid">("all")

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBills(mockBills)
      setFilteredBills(mockBills)
      setIsLoading(false)
    }, 500)
  }, [])

  useEffect(() => {
    let result = bills

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (bill) =>
          bill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bill.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((bill) => bill.status === statusFilter)
    }

    setFilteredBills(result)
  }, [bills, searchTerm, statusFilter])

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
        <h1 className="text-2xl font-bold text-neutral-800">Bills</h1>
        <Link to="/bills/add" className="btn btn-primary">
          <Plus size={18} />
          <span>Add New Bill</span>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-neutral-400" />
          </div>
          <input
            type="text"
            className="input pl-10"
            placeholder="Search bills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Filter size={18} className="text-neutral-500" />
          <select
            className="input"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "pending" | "paid")}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </select>
        </div>
      </div>

      {filteredBills.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
            <FileText size={32} className="text-neutral-400" />
          </div>
          <h3 className="text-lg font-medium text-neutral-800">No bills found</h3>
          <p className="text-neutral-500 mt-1">
            {searchTerm || statusFilter !== "all" ? "Try adjusting your filters" : "Add your first bill to get started"}
          </p>
          {!searchTerm && statusFilter === "all" && (
            <Link to="/bills/add" className="btn btn-primary mt-4 inline-flex">
              <Plus size={18} />
              <span>Add New Bill</span>
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBills.map((bill) => (
            <BillCard key={bill.id} bill={bill} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Bills
