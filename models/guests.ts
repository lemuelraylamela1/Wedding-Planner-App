import mongoose, { Schema, models } from "mongoose";

const guestSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    guestName: { type: String },
    contact: {
      email: String,
      number: String,
    },
    meal: { type: String },
    rsvpStatus: {
      type: String,
      enum: ["accepted", "declined", "pending", "maybe"],
      default: "pending",
    },
    table: {
      type: Number,
    },
    dietaryRestrictions: { type: String },
  },
  {
    timestamps: true,
  },
);

const Guests = models.Guests || mongoose.model("Guests", guestSchema);

export default Guests;
