"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testResult = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const testResultSchema = new mongoose_1.default.Schema({
    applicationId: { type: String, required: true },
    testType: { type: String, enum: ['BMI', 'ISHARA', 'PYSCHOMETRIC'], required: true },
    responses: { type: mongoose_1.default.Schema.Types.Mixed, required: true },
    result: { type: mongoose_1.default.Schema.Types.Mixed, required: true },
    patient: { type: mongoose_1.default.Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now },
    name: { type: String },
    age: { type: Number },
    sex: { type: String }
});
exports.testResult = mongoose_1.default.model('TestResult', testResultSchema);
