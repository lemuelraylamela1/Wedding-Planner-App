// models/Table.ts
import mongoose, { Schema, models } from "mongoose";

const tableSchema = new Schema({
  number: { type: Number, required: true, unique: true },
  capacity: { type: Number, required: true, default: 8 },
  guests: [{ type: Schema.Types.ObjectId, ref: "Guests" }],
});

export const Tables = models.Tables || mongoose.model("Tables", tableSchema);
