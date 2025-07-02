"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import BillForm from "../components/BillForm"
import type { Bill } from "../types"
import { mockBills, mockUsers } from "../data/mockData"

const EditBill = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [bill, setBill] = useState<Bill | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundBill = mockBills.find((b) => b.id === id)
      setBill(foundBill || null)
      setIsLoading(false)
    }, 500)
  }, [id])

  const handleSubmit = (data: Omit<Bill, "id">) => {
    // In a real app, you would send this data to your API
    console.log("Updating bill:", { id, ...data })

    // Navigate back to bill details
    navigate(`/bills/${id}`)
  }

  const handleCancel = () => {
    navigate(`/bills/${id}`)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!bill) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-neutral-800">Bill not found</h3>
        <p className="text-neutral-500 mt-1">The bill you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => navigate("/bills")} className="btn btn-primary mt-4">
          Back to Bills
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-neutral-800 mb-6">Edit Bill</h1>

      <div className="card">
        <BillForm initialData={bill} users={mockUsers} onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </div>
  )
}

export default EditBill
