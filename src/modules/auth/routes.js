"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = require("../auth/controller");
const router = express_1.default.Router();
router.post('/admin/login', controller_1.adminLogin);
router.post('/student/request-otp', controller_1.requestOTP);
router.post('/student/login', controller_1.studentLogin);
router.get('/admin/students', controller_1.getAllStudents);
exports.default = router;
