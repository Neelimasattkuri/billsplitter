export interface User {
  _id: string
  name: string
  email: string
  avatar?: string
}

export interface Bill {
  _id: string
  title: string
  amount: number
  description?: string
  date: string
  dueDate: string
  status: "pending" | "paid"
  users: User[]
  createdBy: User
  category: "gas" | "electricity" | "water" | "internet" | "other"
  amountPerPerson: number
  createdAt: string
  updatedAt: string
}
