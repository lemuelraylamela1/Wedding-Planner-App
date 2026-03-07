import mongoose, { Schema, models } from "mongoose";

const weddingSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    brideName: String,
    groomName: String,
    date: Date,
    location: String,
    theme: String,
    guestCount: Number,
    budget: Number,
  },
  {
    timestamps: true,
  },
);

const Wedding = models.Wedding || mongoose.model("Wedding", weddingSchema);

export default Wedding;
