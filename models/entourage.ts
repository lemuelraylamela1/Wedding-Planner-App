import mongoose, { Schema, model, models } from "mongoose";

const EntourageSchema = new Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    side: { type: String, enum: ["bride", "groom"], required: true },
    relation: { type: String, enum: ["friend", "relative"], required: true },
    tier: { type: String, enum: ["entourage", "vip"], default: "entourage" },
    userId: { type: String, required: true },
  },
  { timestamps: true },
);

const Entourage = models.Entourage || model("Entourage", EntourageSchema);

export default Entourage;
