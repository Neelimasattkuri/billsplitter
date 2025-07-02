"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  DollarSign,
  FileText,
  TrendingUp,
  Users,
  Plus,
  Bell,
  Home,
  Settings,
  X,
  Menu,
  Edit,
  Trash2,
  ArrowLeft,
} from "lucide-react"

// Types
interface User {
  id: string
  name: string
  email: string
}

interface Bill {
  id: string
  title: string
  amount: number
  description: string
  date: string
  dueDate: string
  status: "pending" | "paid"
  userIds: string[]
  createdAt: string
}

// Storage utilities
const storage = {
  getUsers: (): User[] => {
    if (typeof window === "undefined") return []
    const users = localStorage.getItem("gasbill-users")
    return users ? JSON.parse(users) : []
  },
  setUsers: (users: User[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("gasbill-users", JSON.stringify(users))
    }
  },
  getBills: (): Bill[] => {
    if (typeof window === "undefined") return []
    const bills = localStorage.getItem("gasbill-bills")
    return bills ? JSON.parse(bills) : []
  },
  setBills: (bills: Bill[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("gasbill-bills", JSON.stringify(bills))
    }
  },
  getCurrentUser: (): User | null => {
    if (typeof window === "undefined") return null
    const user = localStorage.getItem("gasbill-current-user")
    return user ? JSON.parse(user) : null
  },
  setCurrentUser: (user: User | null) => {
    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("gasbill-current-user", JSON.stringify(user))
      } else {
        localStorage.removeItem("gasbill-current-user")
      }
    }
  },
}

// Components
const LoginForm = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isRegister, setIsRegister] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isRegister) {
      // Register new user
      const users = storage.getUsers()
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
      }
      users.push(newUser)
      storage.setUsers(users)
      onLogin(newUser)
    } else {
      // Login existing user
      const users = storage.getUsers()
      const user = users.find((u) => u.email === email)
      if (user) {
        onLogin(user)
      } else {
        alert("User not found. Please register first.")
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">GB</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{isRegister ? "Create Account" : "Sign In"}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors"
          >
            {isRegister ? "Create Account" : "Sign In"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button onClick={() => setIsRegister(!isRegister)} className="text-teal-600 hover:text-teal-700 text-sm">
            {isRegister ? "Already have an account? Sign in" : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  )
}

const BillForm = ({
  bill,
  users,
  onSave,
  onCancel,
}: {
  bill?: Bill
  users: User[]
  onSave: (bill: Omit<Bill, "id" | "createdAt">) => void
  onCancel: () => void
}) => {
  const [title, setTitle] = useState(bill?.title || "")
  const [amount, setAmount] = useState(bill?.amount?.toString() || "")
  const [description, setDescription] = useState(bill?.description || "")
  const [date, setDate] = useState(bill?.date || new Date().toISOString().split("T")[0])
  const [dueDate, setDueDate] = useState(bill?.dueDate || new Date().toISOString().split("T")[0])
  const [status, setStatus] = useState<"pending" | "paid">(bill?.status || "pending")
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>(bill?.userIds || [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      title,
      amount: Number.parseFloat(amount),
      description,
      date,
      dueDate,
      status,
      userIds: selectedUserIds,
    })
  }

  const toggleUser = (userId: string) => {
    setSelectedUserIds((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{bill ? "Edit Bill" : "Add New Bill"}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount ($)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as "pending" | "paid")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Split Between</label>
            <div className="grid grid-cols-2 gap-2">
              {users.map((user) => (
                <label
                  key={user.id}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedUserIds.includes(user.id)
                      ? "border-teal-500 bg-teal-50"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedUserIds.includes(user.id)}
                    onChange={() => toggleUser(user.id)}
                    className="sr-only"
                  />
                  <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                    <span className="text-teal-700 font-medium text-sm">{user.name.charAt(0)}</span>
                  </div>
                  <span className="font-medium">{user.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              {bill ? "Update Bill" : "Create Bill"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const UserForm = ({
  user,
  onSave,
  onCancel,
}: {
  user?: User
  onSave: (user: Omit<User, "id">) => void
  onCancel: () => void
}) => {
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ name, email })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{user ? "Edit User" : "Add New User"}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              {user ? "Update User" : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function GasBillSplitter() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [bills, setBills] = useState<Bill[]>([])
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showBillForm, setShowBillForm] = useState(false)
  const [showUserForm, setShowUserForm] = useState(false)
  const [editingBill, setEditingBill] = useState<Bill | undefined>()
  const [editingUser, setEditingUser] = useState<User | undefined>()
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null)

  // Load data on mount
  useEffect(() => {
    const user = storage.getCurrentUser()
    if (user) {
      setCurrentUser(user)
      setUsers(storage.getUsers())
      setBills(storage.getBills())
    }
  }, [])

  // Authentication handlers
  const handleLogin = (user: User) => {
    setCurrentUser(user)
    storage.setCurrentUser(user)
    setUsers(storage.getUsers())
    setBills(storage.getBills())
  }

  const handleLogout = () => {
    setCurrentUser(null)
    storage.setCurrentUser(null)
    setCurrentPage("dashboard")
  }

  // Bill handlers
  const handleSaveBill = (billData: Omit<Bill, "id" | "createdAt">) => {
    if (editingBill) {
      // Update existing bill
      const updatedBills = bills.map((bill) =>
        bill.id === editingBill.id ? { ...billData, id: editingBill.id, createdAt: editingBill.createdAt } : bill,
      )
      setBills(updatedBills)
      storage.setBills(updatedBills)
    } else {
      // Create new bill
      const newBill: Bill = {
        ...billData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      }
      const updatedBills = [...bills, newBill]
      setBills(updatedBills)
      storage.setBills(updatedBills)
    }
    setShowBillForm(false)
    setEditingBill(undefined)
  }

  const handleDeleteBill = (billId: string) => {
    if (confirm("Are you sure you want to delete this bill?")) {
      const updatedBills = bills.filter((bill) => bill.id !== billId)
      setBills(updatedBills)
      storage.setBills(updatedBills)
      setSelectedBill(null)
    }
  }

  // User handlers
  const handleSaveUser = (userData: Omit<User, "id">) => {
    if (editingUser) {
      // Update existing user
      const updatedUsers = users.map((user) =>
        user.id === editingUser.id ? { ...userData, id: editingUser.id } : user,
      )
      setUsers(updatedUsers)
      storage.setUsers(updatedUsers)
    } else {
      // Create new user
      const newUser: User = {
        ...userData,
        id: Date.now().toString(),
      }
      const updatedUsers = [...users, newUser]
      setUsers(updatedUsers)
      storage.setUsers(updatedUsers)
    }
    setShowUserForm(false)
    setEditingUser(undefined)
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      const updatedUsers = users.filter((user) => user.id !== userId)
      setUsers(updatedUsers)
      storage.setUsers(updatedUsers)
    }
  }

  // Calculate statistics
  const stats = {
    totalBills: bills.length,
    unpaidBills: bills.filter((bill) => bill.status === "pending").length,
    totalAmount: bills.reduce((sum, bill) => sum + bill.amount, 0),
    unpaidAmount: bills.filter((bill) => bill.status === "pending").reduce((sum, bill) => sum + bill.amount, 0),
  }

  // Get bills with user details
  const getBillsWithUsers = () => {
    return bills.map((bill) => ({
      ...bill,
      users: users.filter((user) => bill.userIds.includes(user.id)),
    }))
  }

  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} />
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <button
          onClick={() => setShowBillForm(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Add New Bill</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bills</p>
              <p className="text-2xl font-bold text-gray-900">${stats.totalAmount.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-teal-50 rounded-lg">
              <DollarSign size={24} className="text-teal-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unpaid Bills</p>
              <p className="text-2xl font-bold text-gray-900">{stats.unpaidBills}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <FileText size={24} className="text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Amount Due</p>
              <p className="text-2xl font-bold text-gray-900">${stats.unpaidAmount.toFixed(2)}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <TrendingUp size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users size={24} className="text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bills */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Bills</h3>
          <button
            onClick={() => setCurrentPage("bills")}
            className="text-teal-600 hover:text-teal-700 text-sm font-medium"
          >
            View all
          </button>
        </div>

        {bills.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow text-center">
            <FileText size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bills yet</h3>
            <p className="text-gray-500 mb-4">Create your first bill to get started</p>
            <button
              onClick={() => setShowBillForm(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg"
            >
              Add New Bill
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getBillsWithUsers()
              .slice(0, 6)
              .map((bill) => (
                <div
                  key={bill.id}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedBill(bill)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{bill.title}</h4>
                      <p className="text-sm text-gray-600">{bill.description}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        bill.status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {bill.status === "paid" ? "Paid" : "Pending"}
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-2xl font-bold text-teal-700">${bill.amount.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">Due: {new Date(bill.dueDate).toLocaleDateString()}</p>
                  </div>

                  <div className="flex items-center">
                    <div className="flex -space-x-2">
                      {bill.users.slice(0, 3).map((user, index) => (
                        <div
                          key={user.id}
                          className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center border-2 border-white"
                        >
                          <span className="text-xs font-medium text-teal-700">{user.name.charAt(0)}</span>
                        </div>
                      ))}
                      {bill.users.length > 3 && (
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border-2 border-white">
                          <span className="text-xs font-medium text-gray-700">+{bill.users.length - 3}</span>
                        </div>
                      )}
                    </div>
                    <span className="ml-3 text-sm text-gray-500">
                      {bill.users.length} {bill.users.length === 1 ? "person" : "people"}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )

  const renderBills = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Bills</h2>
        <button
          onClick={() => setShowBillForm(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Add New Bill</span>
        </button>
      </div>

      {bills.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <FileText size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bills yet</h3>
          <p className="text-gray-500 mb-4">Create your first bill to get started</p>
          <button
            onClick={() => setShowBillForm(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg"
          >
            Add New Bill
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getBillsWithUsers().map((bill) => (
            <div key={bill.id} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 cursor-pointer" onClick={() => setSelectedBill(bill)}>
                  <h4 className="font-semibold text-gray-900">{bill.title}</h4>
                  <p className="text-sm text-gray-600">{bill.description}</p>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => {
                      setEditingBill(bill)
                      setShowBillForm(true)
                    }}
                    className="p-1 text-gray-500 hover:text-teal-600"
                  >
                    <Edit size={16} />
                  </button>
                  <button onClick={() => handleDeleteBill(bill.id)} className="p-1 text-gray-500 hover:text-red-600">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-2xl font-bold text-teal-700">${bill.amount.toFixed(2)}</p>
                <p className="text-sm text-gray-500">Due: {new Date(bill.dueDate).toLocaleDateString()}</p>
                <span
                  className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${
                    bill.status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {bill.status === "paid" ? "Paid" : "Pending"}
                </span>
              </div>

              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {bill.users.slice(0, 3).map((user) => (
                    <div
                      key={user.id}
                      className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center border-2 border-white"
                    >
                      <span className="text-xs font-medium text-teal-700">{user.name.charAt(0)}</span>
                    </div>
                  ))}
                  {bill.users.length > 3 && (
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border-2 border-white">
                      <span className="text-xs font-medium text-gray-700">+{bill.users.length - 3}</span>
                    </div>
                  )}
                </div>
                <span className="ml-3 text-sm text-gray-500">
                  {bill.users.length} {bill.users.length === 1 ? "person" : "people"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Users</h2>
        <button
          onClick={() => setShowUserForm(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Add User</span>
        </button>
      </div>

      {users.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <Users size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users yet</h3>
          <p className="text-gray-500 mb-4">Add users to split bills with</p>
          <button
            onClick={() => setShowUserForm(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg"
          >
            Add User
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                        <span className="text-teal-700 font-medium">{user.name.charAt(0)}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        setEditingUser(user)
                        setShowUserForm(true)
                      }}
                      className="text-teal-600 hover:text-teal-900 mr-4"
                    >
                      <Edit size={16} />
                    </button>
                    <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )

  const renderBillDetails = () => {
    if (!selectedBill) return null

    const billWithUsers = {
      ...selectedBill,
      users: users.filter((user) => selectedBill.userIds.includes(user.id)),
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button onClick={() => setSelectedBill(null)} className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft size={20} className="mr-2" />
            Back to Bills
          </button>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setEditingBill(selectedBill)
                setShowBillForm(true)
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Edit size={16} />
              <span>Edit</span>
            </button>
            <button
              onClick={() => handleDeleteBill(selectedBill.id)}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{billWithUsers.title}</h1>
              {billWithUsers.description && <p className="text-gray-600 mt-1">{billWithUsers.description}</p>}
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                billWithUsers.status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {billWithUsers.status === "paid" ? "Paid" : "Pending"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Bill Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">Total Amount</span>
                  <p className="text-2xl font-bold text-teal-700">${billWithUsers.amount.toFixed(2)}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Per Person</span>
                  <p className="text-xl font-semibold text-gray-900">
                    $
                    {billWithUsers.users.length > 0
                      ? (billWithUsers.amount / billWithUsers.users.length).toFixed(2)
                      : "0.00"}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Date</span>
                  <p className="text-gray-900">{new Date(billWithUsers.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Due Date</span>
                  <p className="text-gray-900">{new Date(billWithUsers.dueDate).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Split Between</h3>
              <div className="space-y-3">
                {billWithUsers.users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                        <span className="text-teal-700 font-medium">{user.name.charAt(0)}</span>
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${(billWithUsers.amount / billWithUsers.users.length).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-teal-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">GB</span>
            </div>
            <span className="text-lg font-semibold">GasBill</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X size={20} />
          </button>
        </div>

        <nav className="mt-4 px-2">
          <div className="space-y-1">
            <button
              onClick={() => {
                setCurrentPage("dashboard")
                setSelectedBill(null)
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                currentPage === "dashboard" && !selectedBill
                  ? "text-teal-700 bg-teal-50"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Home size={18} className="mr-3" />
              Dashboard
            </button>
            <button
              onClick={() => {
                setCurrentPage("bills")
                setSelectedBill(null)
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                currentPage === "bills" && !selectedBill ? "text-teal-700 bg-teal-50" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <FileText size={18} className="mr-3" />
              Bills
            </button>
            <button
              onClick={() => {
                setCurrentPage("users")
                setSelectedBill(null)
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                currentPage === "users" ? "text-teal-700 bg-teal-50" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Users size={18} className="mr-3" />
              Users
            </button>
          </div>
        </nav>

        {/* User info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                <span className="text-teal-700 font-medium">{currentUser.name.charAt(0)}</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                <p className="text-xs text-gray-500">{currentUser.email}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="text-gray-500 hover:text-gray-700" title="Logout">
              <Settings size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden mr-4">
                <Menu size={24} />
              </button>
              <h1 className="text-xl font-semibold text-gray-800">GasBill Splitter</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Bell size={20} className="text-gray-600" />
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                <span className="text-teal-700 font-medium text-sm">{currentUser.name.charAt(0)}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {selectedBill
              ? renderBillDetails()
              : currentPage === "dashboard"
                ? renderDashboard()
                : currentPage === "bills"
                  ? renderBills()
                  : currentPage === "users"
                    ? renderUsers()
                    : null}
          </div>
        </main>
      </div>

      {/* Modals */}
      {showBillForm && (
        <BillForm
          bill={editingBill}
          users={users}
          onSave={handleSaveBill}
          onCancel={() => {
            setShowBillForm(false)
            setEditingBill(undefined)
          }}
        />
      )}

      {showUserForm && (
        <UserForm
          user={editingUser}
          onSave={handleSaveUser}
          onCancel={() => {
            setShowUserForm(false)
            setEditingUser(undefined)
          }}
        />
      )}
    </div>
  )
}
