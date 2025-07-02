"use client"

import type React from "react"

import { useState } from "react"
import { Save } from "lucide-react"

const Settings = () => {
  const [currency, setCurrency] = useState("USD")
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY")
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // In a real app, you would save these settings to your API
    console.log("Saving settings:", {
      currency,
      dateFormat,
      emailNotifications,
      darkMode,
    })

    // Show success message
    alert("Settings saved successfully!")
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-neutral-800 mb-6">Settings</h1>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">General Settings</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="currency" className="label">
                  Currency
                </label>
                <select id="currency" className="input" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD ($)</option>
                  <option value="AUD">AUD ($)</option>
                </select>
              </div>

              <div>
                <label htmlFor="dateFormat" className="label">
                  Date Format
                </label>
                <select
                  id="dateFormat"
                  className="input"
                  value={dateFormat}
                  onChange={(e) => setDateFormat(e.target.value)}
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">Notifications</h2>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-neutral-500">Receive email notifications for new bills and reminders</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={emailNotifications}
                  onChange={() => setEmailNotifications(!emailNotifications)}
                />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">Appearance</h2>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-neutral-500">Switch between light and dark theme</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                />
                <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>

          <div className="pt-4 border-t">
            <button type="submit" className="btn btn-primary">
              <Save size={18} />
              <span>Save Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Settings
