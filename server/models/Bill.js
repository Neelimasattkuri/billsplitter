const mongoose = require("mongoose")

const billSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: ["gas", "electricity", "water", "internet", "other"],
      default: "other",
    },
  },
  {
    timestamps: true,
  },
)

// Index for better query performance
billSchema.index({ createdBy: 1, date: -1 })
billSchema.index({ status: 1 })
billSchema.index({ dueDate: 1 })

// Virtual for amount per person
billSchema.virtual("amountPerPerson").get(function () {
  return this.users.length > 0 ? this.amount / this.users.length : 0
})

// Ensure virtual fields are serialized
billSchema.set("toJSON", { virtuals: true })

module.exports = mongoose.model("Bill", billSchema)
