"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
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
exports.User = mongoose_1.default.model('User', userSchema);
