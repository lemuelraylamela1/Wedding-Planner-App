import mongoose, { Schema, models } from "mongoose";

const weddingSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    brideName: { type: String },
    groomName: { type: String },
    date: { type: Date },
    location: { type: String },
    theme: { type: String },
    guestCount: { type: Number },
    budget: { type: Number },

    ceremonyTime: { type: String },
    receptionTime: { type: String },
    guestArrival: { type: String },
  },
  {
    timestamps: true,
  },
);

const Wedding = models.Wedding || mongoose.model("Wedding", weddingSchema);

export default Wedding;
