"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.firstTime = exports.submitTest = void 0;
const model_1 = require("./model");
const model_2 = require("../user/model");
const submitTest = async (req, res) => {
    try {
        const { applicationId, testType, responses, result, patient } = req.body;
        if (!applicationId || !testType) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const { name, age, sex } = await model_2.User.findOne({ applicationId }) || {};
        const saved = await model_1.testResult.findOneAndUpdate({ applicationId, testType }, {
            applicationId,
            testType,
            responses,
            result,
            patient,
            name,
            age,
            sex
        }, { upsert: true, new: true });
        return res.status(201).json({
            message: 'Test submitted successfully',
            data: saved
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.submitTest = submitTest;
const firstTime = async (req, res) => {
    try {
        const { applicationId, route } = req.params;
        const existingTest = await model_1.testResult.findOne({ applicationId, testType: route });
        if (existingTest) {
            return res.json({ firstTime: false });
        }
        else {
            return res.json({ firstTime: true });
        }
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};
exports.firstTime = firstTime;
