"use client";

import { useRouter } from "next/router";
import BillForm from "../components/BillForm";
import type { Bill } from "../types";
import { mockUsers } from "../data/mockData";

const AddBill = () => {
  const router = useRouter();

  const handleSubmit = (data: Omit<Bill, "id">) => {
    // In a real app, you would send this data to your API
    console.log("Creating new bill:", data);

    // Navigate back to bills page
    router.push("/bills");
  };

  const handleCancel = () => {
    router.push("/bills");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-neutral-800 mb-6">Add New Bill</h1>

      <div className="card">
        <BillForm users={mockUsers} onSubmit={handleSubmit} onCancel={handleCancel} />
      </div>
    </div>
  );
};

export default AddBill;
