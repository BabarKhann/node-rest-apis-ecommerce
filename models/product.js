import Mongoose from 'mongoose';
const Schema = Mongoose.Schema;

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

export default Mongoose.model('Product', productSchema, 'products');
