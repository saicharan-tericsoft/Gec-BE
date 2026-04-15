"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadIshiharaPdf = exports.downloadBMIPdf = void 0;
const model_1 = require("../test/model");
const service_1 = require("./service");
const downloadBMIPdf = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const data = await model_1.testResult.findOne({
            applicationId,
            testType: 'bmi'
        });
        if (!data) {
            return res.status(404).json({ message: 'BMI data not found' });
        }
        const doc = await (0, service_1.generateBMIPdf)(data);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=bmi-${applicationId}.pdf`);
        doc.pipe(res);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error generating PDF' });
    }
};
exports.downloadBMIPdf = downloadBMIPdf;
const downloadIshiharaPdf = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const data = await model_1.testResult.findOne({
            applicationId,
            testType: { $in: ['ISHARA', 'ishihara'] }
        });
        if (!data) {
            return res.status(404).json({ message: 'Ishihara data not found' });
        }
        const doc = await (0, service_1.generateIshiharaPdf)(data);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=ishihara-${applicationId}.pdf`);
        doc.pipe(res);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error generating PDF' });
    }
};
exports.downloadIshiharaPdf = downloadIshiharaPdf;
