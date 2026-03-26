import mongoose, { Schema, models } from "mongoose";

const weddingDayEventSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    time: {
      type: String, // "HH:MM"
      required: true,
    },
    title: String,
    description: String,
    person: String,
    location: String,
    notes: String,
    status: {
      type: String,
      enum: ["pending", "in-progress", "done"],
      default: "pending",
    },
  },
  { timestamps: true },
);

const WeddingDayEvent =
  models.WeddingDayEvent ||
  mongoose.model("WeddingDayEvent", weddingDayEventSchema);

export default WeddingDayEvent;
