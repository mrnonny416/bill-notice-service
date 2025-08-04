import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILink extends Document {
  name: string;
  amount: number;
  status: string;
  slip?: string | null;
  slipUploadedAt?: Date | null;
  statusChangedAt?: Date | null;
  createdAt?: Date;
  paidMessage?: string | null; // เพิ่มตรงนี้
  outStandingBalance?: number;
  dueDate?: Date;
  previousQuota?: number;
  currentQuota?: number;
  nextQuota?: number;
  extraQuota?: number;
}

const LinkSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, required: true },
    slip: { type: String, default: null },
    slipUploadedAt: { type: Date, default: null },
    statusChangedAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
    paidMessage: { type: String, default: null }, // เพิ่มตรงนี้
    outStandingBalance: { type: Number },
    dueDate: { type: Date },
    previousQuota: { type: Number },
    currentQuota: { type: Number },
    nextQuota: { type: Number },
    extraQuota: { type: Number },
  },
  { collection: "links", strict: false }
);

export const LinkModel: Model<ILink> =
  mongoose.models.Link || mongoose.model<ILink>("Link", LinkSchema);