import mongoose from "mongoose";

export interface ITestResult extends Document {
    applicationId: string,
    testType: 'BMI' | 'ISHARA' | 'PYSCHOMETRIC',
    responses: any,
    result: any,
    patient: any,
    createdAt: Date,
    name: string,
    age: number,
    sex: string
}

const testResultSchema = new mongoose.Schema<ITestResult> ({
    applicationId: { type: String, required: true },
    testType: { type: String, enum: ['BMI', 'ISHARA', 'PYSCHOMETRIC'], required: true },
    responses: { type: mongoose.Schema.Types.Mixed, required: true },
    result: { type: mongoose.Schema.Types.Mixed, required: true },
    patient: { type: mongoose.Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now },
    name: { type: String },
    age: { type: Number },
    sex: { type: String }
});

export const testResult = mongoose.model<ITestResult>('TestResult', testResultSchema);