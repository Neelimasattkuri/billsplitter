"use client"

import type React from "react"

import { useState } from "react"
import type { User } from "../types"

interface UserFormProps {
  initialData?: User
  onSubmit: (data: Omit<User, "id">) => void
  onCancel: () => void
}

const UserForm = ({ initialData, onSubmit, onCancel }: UserFormProps) => {
  const [name, setName] = useState(initialData?.name || "")
  const [email, setEmail] = useState(initialData?.email || "")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    onSubmit({
      name,
      email,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="label">
          Name
        </label>
        <input
          id="name"
          type="text"
          className={`input ${errors.name ? "border-error-500 ring-error-500" : ""}`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
        />
        {errors.name && <p className="mt-1 text-sm text-error-500">{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="email" className="label">
          Email
        </label>
        <input
          id="email"
          type="email"
          className={`input ${errors.email ? "border-error-500 ring-error-500" : ""}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john@example.com"
        />
        {errors.email && <p className="mt-1 text-sm text-error-500">{errors.email}</p>}
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {initialData ? "Update User" : "Add User"}
        </button>
      </div>
    </form>
  )
}

export default UserForm
