"use client"

import type { ReactNode } from "react"

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string | ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  variant?: "danger" | "default"
}

const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "default",
}: ConfirmDialogProps) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-black bg-opacity-30 transition-opacity" onClick={onCancel} />

        <div className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left shadow-xl transition-all">
          <h3 className="text-lg font-medium leading-6 text-neutral-900">{title}</h3>
          <div className="mt-2">
            {typeof message === "string" ? <p className="text-sm text-neutral-500">{message}</p> : message}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              {cancelText}
            </button>
            <button
              type="button"
              className={`btn ${variant === "danger" ? "btn-danger" : "btn-primary"}`}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
