import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    // createIndexes will create in indexes in DB, while searchin queries will be fast.
    email: { type: String, required: true, createIndexes: true },
    // email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'customer' },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema, 'users');
