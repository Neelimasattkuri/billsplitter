import type { Bill, User } from "../types"

export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
  },
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane@example.com",
  },
  {
    id: "user-3",
    name: "Robert Johnson",
    email: "robert@example.com",
  },
]

export const mockBills: Bill[] = [
  {
    id: "bill-1",
    title: "Gas Bill - March 2024",
    amount: 85.5,
    description: "Monthly gas utility bill",
    date: "2024-03-01T00:00:00.000Z",
    dueDate: "2024-03-15T00:00:00.000Z",
    status: "pending",
    users: mockUsers,
  },
  {
    id: "bill-2",
    title: "Electricity Bill - March 2024",
    amount: 120.75,
    description: "Monthly electricity bill",
    date: "2024-03-05T00:00:00.000Z",
    dueDate: "2024-03-20T00:00:00.000Z",
    status: "paid",
    users: mockUsers,
  },
  {
    id: "bill-3",
    title: "Water Bill - March 2024",
    amount: 39.25,
    description: "Quarterly water bill",
    date: "2024-03-10T00:00:00.000Z",
    dueDate: "2024-03-25T00:00:00.000Z",
    status: "pending",
    users: mockUsers,
  },
  {
    id: "bill-4",
    title: "Internet Bill - March 2024",
    amount: 65.99,
    description: "Monthly internet service",
    date: "2024-03-12T00:00:00.000Z",
    dueDate: "2024-03-28T00:00:00.000Z",
    status: "pending",
    users: [mockUsers[0], mockUsers[1]],
  },
]
