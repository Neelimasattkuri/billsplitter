export interface User {
  id: string
  name: string
  email: string
}

export interface Bill {
  id: string
  title: string
  amount: number
  description?: string
  date: string
  dueDate: string
  status: "pending" | "paid"
  users: User[]
}
