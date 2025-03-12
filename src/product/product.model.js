import { Schema, model } from "mongoose";

const productSchema = Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  sales: { type: Number, default: 0 },
  image: { type: String },
  category: { type: Schema.Types.ObjectId, ref: "Category" },
});

export default model ("Product", productSchema);