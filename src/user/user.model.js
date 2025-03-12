import { Schema, model } from "mongoose";

const UserSchema = Schema({
    name: { type: String, required: true },
    username:{type: String, require:true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: [true, "Password required"], minLength: 8, },
    preferences:{type: String},
    address:{type: String, require:true},
    role: { type: String, enum: ['ADMIN_ROLE', 'CUSTOMER_ROLE'], default:"CUSTOMER_ROLE"},
    estado: {type: Boolean,default: true,},
    },
    {timestamps: true,versionKey: false,}
);

UserSchema.methods.toJSON = function () {
        const { __v, password, _id, ...user } = this.toObject();
        user.uid = _id;
        return user;
};
export default model("User", UserSchema);