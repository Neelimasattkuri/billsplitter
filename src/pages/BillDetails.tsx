"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { format } from "date-fns";
import { Edit, Trash2, Download, ArrowLeft } from "lucide-react";
import UserShareChart from "../components/UserShareChart";
import ConfirmDialog from "../components/ConfirmDialog";
import type { Bill } from "../types";
import { mockBills } from "../data/mockData";
import { generatePDF } from "../utils/pdfGenerator";

const BillDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [bill, setBill] = useState<Bill | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!id) return;

    const foundBill = mockBills.find((b) => b.id === id);
    setBill(foundBill || null);
    setIsLoading(false);
  }, [id]);

  const handleDelete = () => {
    console.log("Deleting bill:", id);
    router.push("/bills");
  };

  const handleExportPDF = () => {
    if (bill) {
      generatePDF(bill);
    }
  };

  const userShareData =
    bill?.users.map((user, index) => {
      const colors = [
        "rgba(14, 165, 233, 0.7)",
        "rgba(20, 184, 166, 0.7)",
        "rgba(217, 70, 239, 0.7)",
        "rgba(245, 158, 11, 0.7)",
      ];

      const amount = bill.amount / bill.users.length;

      return {
        name: user.name,
        amount,
        color: colors[index % colors.length],
      };
    }) || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-neutral-800">Bill not found</h3>
        <p className="text-neutral-500 mt-1">The bill you're looking for doesn't exist or has been removed.</p>
        <button onClick={() => router.push("/bills")} className="btn btn-primary mt-4">
          Back to Bills
        </button>
      </div>
    );
  }

  const isPaid = bill.status === "paid";
  const isOverdue = !isPaid && new Date(bill.dueDate) < new Date();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/bills" className="inline-flex items-center text-neutral-600 hover:text-neutral-800">
          <ArrowLeft size={16} className="mr-1" />
          <span>Back to Bills</span>
        </Link>
      </div>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">{bill.title}</h1>
          {bill.description && <p className="text-neutral-500 mt-1">{bill.description}</p>}
        </div>

        <div className="flex space-x-2">
          <button onClick={handleExportPDF} className="btn btn-secondary" aria-label="Export as PDF">
            <Download size={18} />
            <span className="hidden sm:inline ml-1">Export</span>
          </button>
          <Link href={`/bills/${id}/edit`} className="btn btn-secondary" aria-label="Edit bill">
            <Edit size={18} />
            <span className="hidden sm:inline ml-1">Edit</span>
          </Link>
          <button onClick={() => setShowDeleteConfirm(true)} className="btn btn-danger" aria-label="Delete bill">
            <Trash2 size={18} />
            <span className="hidden sm:inline ml-1">Delete</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-neutral-800">Bill Details</h2>
              </div>
              <div className={`badge ${isPaid ? "badge-success" : isOverdue ? "badge-error" : "badge-warning"}`}>
                {isPaid ? "Paid" : isOverdue ? "Overdue" : "Pending"}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-neutral-500">Amount</p>
                <p className="text-2xl font-bold text-primary-700">${bill.amount.toFixed(2)}</p>
              </div>

              <div>
                <p className="text-sm text-neutral-500">Per Person</p>
                <p className="text-2xl font-bold text-primary-700">${(bill.amount / bill.users.length).toFixed(2)}</p>
              </div>

              <div>
                <p className="text-sm text-neutral-500">Bill Date</p>
                <p className="text-neutral-800">{format(new Date(bill.date), "MMMM d, yyyy")}</p>
              </div>

              <div>
                <p className="text-sm text-neutral-500">Due Date</p>
                <p className="text-neutral-800">{format(new Date(bill.dueDate), "MMMM d, yyyy")}</p>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm text-neutral-500 mb-2">Split Between</p>
              <div className="flex flex-wrap gap-2">
                {bill.users.map((user) => (
                  <div key={user.id} className="flex items-center px-3 py-2 rounded-lg bg-neutral-100">
                    <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-xs text-primary-700 font-medium">{user.name.charAt(0)}</span>
                    </div>
                    <span className="ml-2 text-sm font-medium">{user.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="card">
            <h2 className="text-lg font-semibold text-neutral-800 mb-4">Expense Distribution</h2>
            <div className="h-64">
              <UserShareChart data={userShareData} />
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Bill"
        message="Are you sure you want to delete this bill? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        variant="danger"
      />
    </div>
  );
};

export default BillDetails;
