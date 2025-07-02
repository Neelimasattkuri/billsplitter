"use client"

import { Bell, LogOut } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { useState } from "react"

interface HeaderProps {
  onMenuClick: () => void
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const { user, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <header className="bg-white border-b border-neutral-200 py-4 px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center">
        <button onClick={onMenuClick} className="mr-4 md:hidden" aria-label="Open menu">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 className="text-xl font-semibold text-neutral-800">GasBill Splitter</h1>
      </div>

      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-neutral-100" aria-label="Notifications">
          <Bell size={20} className="text-neutral-600" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 p-2 rounded-full hover:bg-neutral-100"
          >
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-700 font-medium text-sm">{user?.name?.charAt(0)?.toUpperCase()}</span>
            </div>
            <span className="hidden md:block text-sm font-medium">{user?.name}</span>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <div className="px-4 py-2 text-sm text-neutral-700 border-b">
                <div className="font-medium">{user?.name}</div>
                <div className="text-neutral-500">{user?.email}</div>
              </div>
              <button
                onClick={logout}
                className="flex items-center w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
              >
                <LogOut size={16} className="mr-2" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      {showUserMenu && <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />}
    </header>
  )
}

export default Header
