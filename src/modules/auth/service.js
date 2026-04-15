"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentLogin = exports.requestStudentOTP = exports.adminLogin = void 0;
const model_1 = require("../user/model");
const hash_1 = require("../../utils/hash");
const jwt_1 = require("../../utils/jwt");
const service_1 = require("../otp/service");
// ADMIN LOGIN
const adminLogin = async (email, password) => {
    const user = await model_1.User.findOne({ email, role: 'admin' });
    if (!user)
        throw new Error('Invalid credentials');
    const isMatch = await (0, hash_1.comparePassword)(password, user.passwordHash);
    if (!isMatch)
        throw new Error('Invalid credentials');
    return (0, jwt_1.generateToken)({
        userId: user._id,
        role: user.role,
        adminType: user.adminType
    });
};
exports.adminLogin = adminLogin;
// STUDENT REQUEST OTP
const requestStudentOTP = async (email, applicationId, flag) => {
    const field = flag ? 'email' : 'phoneNo';
    const user = await model_1.User.findOne({ [field]: email, applicationId, role: 'student' });
    if (!user || !user.isEligible) {
        throw new Error('Not eligible');
    }
    await (0, service_1.generateOTP)(email);
};
exports.requestStudentOTP = requestStudentOTP;
// STUDENT LOGIN WITH OTP
const studentLogin = async (email, otp) => {
    const field = email.includes('@') ? 'email' : 'phoneNo';
    const isValid = await (0, service_1.verifyOTP)(email, otp, field);
    if (!isValid)
        throw new Error('Invalid OTP');
    const user = await model_1.User.findOne({ [field]: email });
    return (0, jwt_1.generateToken)({
        userId: user._id,
        role: 'student'
    });
};
exports.studentLogin = studentLogin;
