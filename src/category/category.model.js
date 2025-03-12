import { Schema, model } from "mongoose";


const categorySchema = Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  estado: {type: Boolean,default: true,},
},);

export default model("Category", categorySchema);