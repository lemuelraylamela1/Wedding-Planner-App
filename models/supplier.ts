import mongoose, { Schema, models } from "mongoose";

const supplierSchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    status: {
      type: String,
      enum: ["inquiry", "quoted", "booked", "paid"],
      default: "inquiry",
    },
    contact: { type: String },
    email: { type: String },
    phone: { type: String },
    facebook: { type: String },
    cost: { type: Number, default: 0 },
    notes: { type: String },
    userId: { type: String, required: true },
    headCount: { type: Number },
  },
  { timestamps: true },
);

const Suppliers = models.Supplier || mongoose.model("Supplier", supplierSchema);

export default Suppliers;
