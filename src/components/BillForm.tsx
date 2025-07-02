"use client"

import type React from "react"

import { useState } from "react"
import type { Bill, User } from "../types"
import { format } from "date-fns"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"

interface BillFormProps {
  initialData?: Bill
  users: User[]
  onSubmit: (data: Omit<Bill, "id">) => void
  onCancel: () => void
}

const BillForm = ({ initialData, users, onSubmit, onCancel }: BillFormProps) => {
  const [title, setTitle] = useState(initialData?.title || "")
  const [amount, setAmount] = useState(initialData?.amount.toString() || "")
  const [description, setDescription] = useState(initialData?.description || "")
  const [date, setDate] = useState<Date>(initialData?.date ? new Date(initialData.date) : new Date())
  const [dueDate, setDueDate] = useState<Date>(initialData?.dueDate ? new Date(initialData.dueDate) : new Date())
  const [status, setStatus] = useState<"pending" | "paid">(initialData?.status || "pending")
  const [selectedUsers, setSelectedUsers] = useState<string[]>(initialData?.users.map((user) => user.id) || [])
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showDueDatePicker, setShowDueDatePicker] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!amount.trim()) {
      newErrors.amount = "Amount is required"
    } else if (isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = "Amount must be a positive number"
    }

    if (selectedUsers.length === 0) {
      newErrors.users = "At least one user must be selected"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const billData: Omit<Bill, "id"> = {
      title,
      amount: Number.parseFloat(amount),
      description,
      date: date.toISOString(),
      dueDate: dueDate.toISOString(),
      status,
      users: users.filter((user) => selectedUsers.includes(user.id)),
    }

    onSubmit(billData)
  }

  const toggleUser = (userId: string) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="label">
          Bill Title
        </label>
        <input
          id="title"
          type="text"
          className={`input ${errors.title ? "border-error-500 ring-error-500" : ""}`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Gas Bill March 2024"
        />
        {errors.title && <p className="mt-1 text-sm text-error-500">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="amount" className="label">
          Amount ($)
        </label>
        <input
          id="amount"
          type="text"
          className={`input ${errors.amount ? "border-error-500 ring-error-500" : ""}`}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
        />
        {errors.amount && <p className="mt-1 text-sm text-error-500">{errors.amount}</p>}
      </div>

      <div>
        <label htmlFor="description" className="label">
          Description (Optional)
        </label>
        <textarea
          id="description"
          className="input min-h-[80px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add any additional details about this bill"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label htmlFor="date" className="label">
            Bill Date
          </label>
          <input
            id="date"
            type="text"
            className="input cursor-pointer"
            value={format(date, "MMMM d, yyyy")}
            onClick={() => setShowDatePicker(true)}
            readOnly
          />
          {showDatePicker && (
            <div className="absolute z-10 mt-1 bg-white shadow-lg rounded-lg p-2">
              <Calendar
                value={date}
                onChange={(value) => {
                  setDate(value as Date)
                  setShowDatePicker(false)
                }}
              />
            </div>
          )}
        </div>

        <div className="relative">
          <label htmlFor="dueDate" className="label">
            Due Date
          </label>
          <input
            id="dueDate"
            type="text"
            className="input cursor-pointer"
            value={format(dueDate, "MMMM d, yyyy")}
            onClick={() => setShowDueDatePicker(true)}
            readOnly
          />
          {showDueDatePicker && (
            <div className="absolute z-10 mt-1 bg-white shadow-lg rounded-lg p-2">
              <Calendar
                value={dueDate}
                onChange={(value) => {
                  setDueDate(value as Date)
                  setShowDueDatePicker(false)
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="label">Status</label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              className="w-4 h-4 text-primary-600 focus:ring-primary-500"
              checked={status === "pending"}
              onChange={() => setStatus("pending")}
            />
            <span className="ml-2">Pending</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              className="w-4 h-4 text-primary-600 focus:ring-primary-500"
              checked={status === "paid"}
              onChange={() => setStatus("paid")}
            />
            <span className="ml-2">Paid</span>
          </label>
        </div>
      </div>

      <div>
        <label className="label">Split Between</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {users.map((user) => (
            <label
              key={user.id}
              className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                selectedUsers.includes(user.id)
                  ? "border-primary-500 bg-primary-50"
                  : "border-neutral-300 hover:bg-neutral-50"
              }`}
            >
              <input
                type="checkbox"
                className="sr-only"
                checked={selectedUsers.includes(user.id)}
                onChange={() => toggleUser(user.id)}
              />
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-700 font-medium">{user.name.charAt(0)}</span>
              </div>
              <span className="ml-3 font-medium">{user.name}</span>
            </label>
          ))}
        </div>
        {errors.users && <p className="mt-1 text-sm text-error-500">{errors.users}</p>}
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {initialData ? "Update Bill" : "Create Bill"}
        </button>
      </div>
    </form>
  )
}

export default BillForm
