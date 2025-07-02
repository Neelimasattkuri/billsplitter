"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { authAPI } from "../services/api"

interface User {
  _id: string
  name: string
  email: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (data: { name?: string; email?: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem("token")
      if (savedToken) {
        try {
          const response = await authAPI.getCurrentUser()
          setUser(response.data.user)
          setToken(savedToken)
        } catch (error) {
          localStorage.removeItem("token")
          setToken(null)
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password)
      const { token: newToken, user: newUser } = response.data

      localStorage.setItem("token", newToken)
      setToken(newToken)
      setUser(newUser)
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed")
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await authAPI.register(name, email, password)
      const { token: newToken, user: newUser } = response.data

      localStorage.setItem("token", newToken)
      setToken(newToken)
      setUser(newUser)
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Registration failed")
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
  }

  const updateProfile = async (data: { name?: string; email?: string }) => {
    try {
      const response = await authAPI.updateProfile(data)
      setUser(response.data.user)
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Profile update failed")
    }
  }

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
