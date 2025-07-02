"use client"

import { Bell, User } from "lucide-react"

interface HeaderProps {
  onMenuClick: () => void
}

const Header = ({ onMenuClick }: HeaderProps) => {
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
        <button className="p-2 rounded-full hover:bg-neutral-100" aria-label="User profile">
          <User size={20} className="text-neutral-600" />
        </button>
      </div>
    </header>
  )
}

export default Header
