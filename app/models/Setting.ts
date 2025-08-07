
import mongoose, { Schema, Document, models } from 'mongoose';

export interface ISetting extends Document {
  key: string;
  value: string;
}

const SettingSchema: Schema = new Schema({
  key: { type: String, required: true, unique: true },
  value: { type: String, required: true },
});

const Setting = models.Setting || mongoose.model<ISetting>('Setting', SettingSchema);
export default Setting;
