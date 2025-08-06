
import mongoose, { Schema, models } from "mongoose";

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

const User = models.User || mongoose.model("User", UserSchema);

export default User;
