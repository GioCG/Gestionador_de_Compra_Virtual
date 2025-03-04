import mongoose from "mongoose";
 
const billItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }, // Producto comprado
  name: { type: String, required: true }, 
  quantity: { type: Number, required: true }, 
  price: { type: Number, required: true }, 
  subtotal: { type: Number, required: true }, 
});
 
const billSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Usuario que realizó la compra
  items: [billItemSchema], 
  total: { type: Number, required: true }, 
  date: { type: Date, default: Date.now }, 
});
 
export default mongoose.model("Bill", billSchema);