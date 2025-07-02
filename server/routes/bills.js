const express = require("express")
const { body, validationResult, query } = require("express-validator")
const Bill = require("../models/Bill")
const User = require("../models/User")

const router = express.Router()

// Get all bills for the authenticated user
router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }).withMessage("Page must be a positive integer"),
    query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100"),
    query("status").optional().isIn(["pending", "paid"]).withMessage("Status must be pending or paid"),
    query("category").optional().isIn(["gas", "electricity", "water", "internet", "other"]),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      const page = Number.parseInt(req.query.page) || 1
      const limit = Number.parseInt(req.query.limit) || 10
      const skip = (page - 1) * limit

      // Build query
      const query = {
        $or: [{ createdBy: req.user._id }, { users: req.user._id }],
      }

      if (req.query.status) {
        query.status = req.query.status
      }

      if (req.query.category) {
        query.category = req.query.category
      }

      if (req.query.search) {
        query.$and = query.$and || []
        query.$and.push({
          $or: [
            { title: { $regex: req.query.search, $options: "i" } },
            { description: { $regex: req.query.search, $options: "i" } },
          ],
        })
      }

      const bills = await Bill.find(query)
        .populate("users", "name email avatar")
        .populate("createdBy", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)

      const total = await Bill.countDocuments(query)

      res.json({
        bills,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      })
    } catch (error) {
      console.error("Get bills error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Get bill by ID
router.get("/:id", async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id)
      .populate("users", "name email avatar")
      .populate("createdBy", "name email")

    if (!bill) {
      return res.status(404).json({ message: "Bill not found" })
    }

    // Check if user has access to this bill
    const hasAccess =
      bill.createdBy._id.equals(req.user._id) || bill.users.some((user) => user._id.equals(req.user._id))

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" })
    }

    res.json(bill)
  } catch (error) {
    console.error("Get bill error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Create new bill
router.post(
  "/",
  [
    body("title")
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Title is required and must be less than 100 characters"),
    body("amount").isFloat({ min: 0.01 }).withMessage("Amount must be greater than 0"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Description must be less than 500 characters"),
    body("date").isISO8601().withMessage("Date must be a valid date"),
    body("dueDate").isISO8601().withMessage("Due date must be a valid date"),
    body("status").optional().isIn(["pending", "paid"]).withMessage("Status must be pending or paid"),
    body("users").isArray({ min: 1 }).withMessage("At least one user must be selected"),
    body("users.*").isMongoId().withMessage("Invalid user ID"),
    body("category").optional().isIn(["gas", "electricity", "water", "internet", "other"]),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      const { title, amount, description, date, dueDate, status, users, category } = req.body

      // Verify all users exist
      const userCount = await User.countDocuments({ _id: { $in: users } })
      if (userCount !== users.length) {
        return res.status(400).json({ message: "One or more users not found" })
      }

      const bill = new Bill({
        title,
        amount,
        description,
        date,
        dueDate,
        status: status || "pending",
        users,
        createdBy: req.user._id,
        category: category || "other",
      })

      await bill.save()
      await bill.populate("users", "name email avatar")
      await bill.populate("createdBy", "name email")

      res.status(201).json({ message: "Bill created successfully", bill })
    } catch (error) {
      console.error("Create bill error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Update bill
router.put(
  "/:id",
  [
    body("title")
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Title must be less than 100 characters"),
    body("amount").optional().isFloat({ min: 0.01 }).withMessage("Amount must be greater than 0"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Description must be less than 500 characters"),
    body("date").optional().isISO8601().withMessage("Date must be a valid date"),
    body("dueDate").optional().isISO8601().withMessage("Due date must be a valid date"),
    body("status").optional().isIn(["pending", "paid"]).withMessage("Status must be pending or paid"),
    body("users").optional().isArray({ min: 1 }).withMessage("At least one user must be selected"),
    body("users.*").optional().isMongoId().withMessage("Invalid user ID"),
    body("category").optional().isIn(["gas", "electricity", "water", "internet", "other"]),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: "Validation failed",
          errors: errors.array(),
        })
      }

      const bill = await Bill.findById(req.params.id)
      if (!bill) {
        return res.status(404).json({ message: "Bill not found" })
      }

      // Check if user can edit this bill
      if (!bill.createdBy.equals(req.user._id)) {
        return res.status(403).json({ message: "Only the bill creator can edit this bill" })
      }

      // If users are being updated, verify they exist
      if (req.body.users) {
        const userCount = await User.countDocuments({ _id: { $in: req.body.users } })
        if (userCount !== req.body.users.length) {
          return res.status(400).json({ message: "One or more users not found" })
        }
      }

      const updatedBill = await Bill.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        .populate("users", "name email avatar")
        .populate("createdBy", "name email")

      res.json({ message: "Bill updated successfully", bill: updatedBill })
    } catch (error) {
      console.error("Update bill error:", error)
      res.status(500).json({ message: "Server error" })
    }
  },
)

// Delete bill
router.delete("/:id", async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id)
    if (!bill) {
      return res.status(404).json({ message: "Bill not found" })
    }

    // Check if user can delete this bill
    if (!bill.createdBy.equals(req.user._id)) {
      return res.status(403).json({ message: "Only the bill creator can delete this bill" })
    }

    await Bill.findByIdAndDelete(req.params.id)
    res.json({ message: "Bill deleted successfully" })
  } catch (error) {
    console.error("Delete bill error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get bill statistics
router.get("/stats/summary", async (req, res) => {
  try {
    const userId = req.user._id

    // Get bills where user is involved
    const billQuery = {
      $or: [{ createdBy: userId }, { users: userId }],
    }

    const [totalBills, unpaidBills, totalAmount, unpaidAmount] = await Promise.all([
      Bill.countDocuments(billQuery),
      Bill.countDocuments({ ...billQuery, status: "pending" }),
      Bill.aggregate([{ $match: billQuery }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
      Bill.aggregate([
        { $match: { ...billQuery, status: "pending" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ])

    // Get monthly expenses for the last 6 months
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const monthlyExpenses = await Bill.aggregate([
      {
        $match: {
          ...billQuery,
          date: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          amount: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ])

    res.json({
      totalBills,
      unpaidBills,
      totalAmount: totalAmount[0]?.total || 0,
      unpaidAmount: unpaidAmount[0]?.total || 0,
      monthlyExpenses,
    })
  } catch (error) {
    console.error("Get stats error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
