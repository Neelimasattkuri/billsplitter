"use client"

import { Link, useLocation } from "react-router-dom"
import { Home, FileText, Users, Settings, X } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

const Sidebar = ({ open, setOpen }: SidebarProps) => {
  const location = useLocation()
  const { user } = useAuth()

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`)
  }

  const navItems = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "Bills", path: "/bills", icon: FileText },
    { name: "Users", path: "/users", icon: Users },
    { name: "Settings", path: "/settings", icon: Settings },
  ]

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {open && <div className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden" onClick={() => setOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-neutral-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:z-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-200">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-md bg-primary-600 flex items-center justify-center">
                <span className="text-white font-bold">GB</span>
              </div>
              <span className="text-lg font-semibold text-neutral-800">GasBill</span>
            </Link>
            <button onClick={() => setOpen(false)} className="md:hidden" aria-label="Close menu">
              <X size={20} className="text-neutral-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                    isActive(item.path) ? "bg-primary-50 text-primary-700" : "text-neutral-600 hover:bg-neutral-100"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <Icon size={20} className="mr-3" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-neutral-200">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-700 font-medium">{user?.name?.charAt(0)?.toUpperCase()}</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-neutral-800">{user?.name}</p>
                <p className="text-xs text-neutral-500">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
