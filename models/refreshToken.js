import Mongoose from 'mongoose';
const { Schema } = Mongoose;

const refreshTokenSchema = Schema(
  {
    token: { type: String, createIndexes: true },
  },
  { timestamps: false }
);

export default Mongoose.model(
  'RefreshToken',
  refreshTokenSchema,
  'refreshTokens'
);
