import { jsPDF } from "jspdf"
import { format } from "date-fns"
import type { Bill } from "../types"

export const generatePDF = (bill: Bill) => {
  const doc = new jsPDF()

  // Add title
  doc.setFontSize(20)
  doc.setTextColor(15, 94, 89) // primary-800
  doc.text("GasBill Splitter", 105, 20, { align: "center" })

  // Add bill title
  doc.setFontSize(16)
  doc.setTextColor(30, 41, 59) // neutral-800
  doc.text(bill.title, 105, 35, { align: "center" })

  // Add horizontal line
  doc.setDrawColor(203, 213, 225) // neutral-300
  doc.line(20, 40, 190, 40)

  // Add bill details
  doc.setFontSize(12)
  doc.setTextColor(71, 85, 105) // neutral-600

  const startY = 50
  const lineHeight = 8

  doc.text("Bill Details:", 20, startY)
  doc.text(`Amount: $${bill.amount.toFixed(2)}`, 20, startY + lineHeight)
  doc.text(`Date: ${format(new Date(bill.date), "MMMM d, yyyy")}`, 20, startY + lineHeight * 2)
  doc.text(`Due Date: ${format(new Date(bill.dueDate), "MMMM d, yyyy")}`, 20, startY + lineHeight * 3)
  doc.text(`Status: ${bill.status === "paid" ? "Paid" : "Pending"}`, 20, startY + lineHeight * 4)

  if (bill.description) {
    doc.text("Description:", 20, startY + lineHeight * 6)
    doc.text(bill.description, 20, startY + lineHeight * 7)
  }

  // Add users section
  const usersStartY = startY + lineHeight * 9

  doc.text("Split Between:", 20, usersStartY)

  bill.users.forEach((user, index) => {
    doc.text(`- ${user.name} (${user.email})`, 20, usersStartY + lineHeight * (index + 1))
  })

  // Add per person amount
  const perPersonAmount = bill.amount / bill.users.length

  doc.text("Amount Per Person:", 20, usersStartY + lineHeight * (bill.users.length + 2))
  doc.setFontSize(14)
  doc.setTextColor(15, 118, 110) // primary-700
  doc.text(`$${perPersonAmount.toFixed(2)}`, 20, usersStartY + lineHeight * (bill.users.length + 3))

  // Add footer
  doc.setFontSize(10)
  doc.setTextColor(100, 116, 139) // neutral-500
  doc.text(`Generated on ${format(new Date(), "MMMM d, yyyy")}`, 105, 280, { align: "center" })

  // Save the PDF
  doc.save(`${bill.title.replace(/\s+/g, "-").toLowerCase()}.pdf`)
}
