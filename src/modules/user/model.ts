import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    phoneNo: { type: Number, required: true },
    applicationId: { type: String, required: true },
    passwordHash: { type: String, }, //only for admins
    age: { type: Number },
    sex: { type: String },
    name: { type: String },
    role: {
    type: String,
    enum: ['student', 'admin'], //need to change this
    required: true
  },
    adminType: {
    type: String,
    enum: ['super', 'junior', 'collegeIT'],
    default: null
  },
    isEligible: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });


export const User = mongoose.model('User', userSchema);