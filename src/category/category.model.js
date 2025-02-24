import { Schema, model } from "mongoose";

const UserSchema = Schema({
    name: { type: String, required: true },
    estado: {type: Boolean,default: true,}
    },
    {timestamps: true,versionKey: false,});


UserSchema.methods.toJSON = function () {
  const { __v, password, _id, ...user } = this.toObject();
  user.uid = _id;
  return user;
};

export default model("User", UserSchema);