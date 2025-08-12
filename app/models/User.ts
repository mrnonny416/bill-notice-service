
import mongoose, { Schema, models, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  password?: string;
  promptpayNumber?: string;
}

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, "Please provide a username."],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password."],
  },
  promptpayNumber: {
    type: String,
  },
});

const User = models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
