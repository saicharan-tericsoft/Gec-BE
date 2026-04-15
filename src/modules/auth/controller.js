"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllStudents = exports.studentLogin = exports.requestOTP = exports.adminLogin = void 0;
const authService = __importStar(require("../auth/service"));
const model_1 = require("../user/model");
const adminLogin = async (req, res) => {
    try {
        const token = await authService.adminLogin(req.body.email, req.body.password);
        res.json({ token });
    }
    catch (err) {
        res.status(401).json({ message: err.message });
    }
};
exports.adminLogin = adminLogin;
const requestOTP = async (req, res) => {
    try {
        const emailId = req.body.email;
        const applicationId = req.body.applicationId;
        const flag = emailId.includes('@') ? true : false;
        await authService.requestStudentOTP(emailId, applicationId, flag);
        res.json({ message: 'OTP sent' });
    }
    catch (err) {
        res.status(400).json({ message: err.message });
    }
};
exports.requestOTP = requestOTP;
const studentLogin = async (req, res) => {
    try {
        const token = await authService.studentLogin(req.body.email, req.body.otp);
        res.json({ token });
    }
    catch (err) {
        res.status(401).json({ message: err.message });
    }
};
exports.studentLogin = studentLogin;
const getAllStudents = async (req, res) => {
    try {
        const students = await model_1.User.find({ role: 'student' })
            .select('name email applicationId');
        res.json(students);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
};
exports.getAllStudents = getAllStudents;
