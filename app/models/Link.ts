import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "./User";

export interface ILink extends Document {
  name: string;
  amount: number;
  status: string;
  slip?: string | null;
  slipUploadedAt?: Date | null;
  statusChangedAt?: Date | null;
  createdAt?: Date;
  paidMessage?: string | null;
  outStandingBalance?: number;
  dueDate?: Date;
  previousQuota?: number;
  currentQuota?: number;
  nextQuota?: number;
  extraQuota?: number;
  qrAccessedAt?: Date | null;
  transactionId?: string | null;
  createdBy: IUser["_id"];
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
    paidMessage: { type: String, default: null },
    outStandingBalance: { type: Number },
    dueDate: { type: Date },
    previousQuota: { type: Number },
    currentQuota: { type: Number },
    nextQuota: { type: Number },
    extraQuota: { type: Number },
    qrAccessedAt: { type: Date, default: null },
    transactionId: { type: String, default: null },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { collection: "links", strict: false }
);

const LinkModel: Model<ILink> =
  mongoose.models.Link || mongoose.model<ILink>("Link", LinkSchema);

export default LinkModel;
