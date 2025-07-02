"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Mail } from "lucide-react"
import UserForm from "../components/UserForm"
import ConfirmDialog from "../components/ConfirmDialog"
import type { User } from "../types"
import { mockUsers } from "../data/mockData"

const Users = () => {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUsers(mockUsers)
      setIsLoading(false)
    }, 500)
  }, [])

  const handleAddUser = (data: Omit<User, "id">) => {
    // In a real app, you would send this data to your API
    const newUser = {
      id: `user-${Date.now()}`,
      ...data,
    }

    setUsers([...users, newUser])
    setShowAddForm(false)
  }

  const handleUpdateUser = (data: Omit<User, "id">) => {
    if (!editingUser) return

    // In a real app, you would send this data to your API
    const updatedUsers = users.map((user) => (user.id === editingUser.id ? { ...user, ...data } : user))

    setUsers(updatedUsers)
    setEditingUser(null)
  }

  const handleDeleteUser = () => {
    if (!userToDelete) return

    // In a real app, you would send a delete request to your API
    const updatedUsers = users.filter((user) => user.id !== userToDelete.id)

    setUsers(updatedUsers)
    setUserToDelete(null)
  }

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
        <h1 className="text-2xl font-bold text-neutral-800">Users</h1>
        <button onClick={() => setShowAddForm(true)} className="btn btn-primary">
          <Plus size={18} />
          <span>Add User</span>
        </button>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
            <Users size={32} className="text-neutral-400" />
          </div>
          <h3 className="text-lg font-medium text-neutral-800">No users found</h3>
          <p className="text-neutral-500 mt-1">Add your first user to get started</p>
          <button onClick={() => setShowAddForm(true)} className="btn btn-primary mt-4 inline-flex">
            <Plus size={18} />
            <span>Add User</span>
          </button>
        </div>
      ) : (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-500">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-500">Email</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-neutral-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-4 text-sm">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-primary-700 font-medium">{user.name.charAt(0)}</span>
                        </div>
                        <span className="ml-3 font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <div className="flex items-center">
                        <Mail size={16} className="text-neutral-400 mr-2" />
                        <span>{user.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => setEditingUser(user)}
                          className="p-1 rounded-md hover:bg-neutral-100"
                          aria-label="Edit user"
                        >
                          <Edit size={16} className="text-neutral-500" />
                        </button>
                        <button
                          onClick={() => setUserToDelete(user)}
                          className="p-1 rounded-md hover:bg-neutral-100"
                          aria-label="Delete user"
                        >
                          <Trash2 size={16} className="text-neutral-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add User Form */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4 text-center">
            <div
              className="fixed inset-0 bg-black bg-opacity-30 transition-opacity"
              onClick={() => setShowAddForm(false)}
            />

            <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl transition-all">
              <h3 className="text-lg font-medium leading-6 text-neutral-900 mb-4">Add New User</h3>

              <UserForm onSubmit={handleAddUser} onCancel={() => setShowAddForm(false)} />
            </div>
          </div>
        </div>
      )}

      {/* Edit User Form */}
      {editingUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4 text-center">
            <div
              className="fixed inset-0 bg-black bg-opacity-30 transition-opacity"
              onClick={() => setEditingUser(null)}
            />

            <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl transition-all">
              <h3 className="text-lg font-medium leading-6 text-neutral-900 mb-4">Edit User</h3>

              <UserForm initialData={editingUser} onSubmit={handleUpdateUser} onCancel={() => setEditingUser(null)} />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!userToDelete}
        title="Delete User"
        message={
          <div>
            <p className="text-sm text-neutral-500">
              Are you sure you want to delete <span className="font-medium">{userToDelete?.name}</span>?
            </p>
            <p className="text-sm text-neutral-500 mt-2">
              This action cannot be undone, and all bills associated with this user will be affected.
            </p>
          </div>
        }
        confirmText="Delete"
        onConfirm={handleDeleteUser}
        onCancel={() => setUserToDelete(null)}
        variant="danger"
      />
    </div>
  )
}

export default Users
