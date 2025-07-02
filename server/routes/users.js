const express = require("express")
const { body, validationResult } = require("express-validator")
const User = require("../models/User")

const router = express.Router()

// Get all users (for bill splitting)
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, "name email avatar").sort({ name: 1 })
    res.json(users)
  } catch (error) {
    console.error("Get users error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Get user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "name email avatar")
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json(user)
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Search users by name or email
router.get("/search/:query", async (req, res) => {
  try {
    const { query } = req.params
    const users = await User.find(
      {
        $or: [{ name: { $regex: query, $options: "i" } }, { email: { $regex: query, $options: "i" } }],
      },
      "name email avatar",
    ).limit(10)

    res.json(users)
  } catch (error) {
    console.error("Search users error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
