import { Request, Response } from 'express';
import { testResult } from '../test/model';
import { generateBMIPdf, generateIshiharaPdf } from './service';

export const downloadBMIPdf = async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.params;

    const data = await testResult.findOne({
      applicationId,
      testType: 'bmi'
    });

    if (!data) {
      return res.status(404).json({ message: 'BMI data not found' });
    }

    const doc = await generateBMIPdf(data);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=bmi-${applicationId}.pdf`
    );

    doc.pipe(res);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error generating PDF' });
  }
};

export const downloadIshiharaPdf = async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.params;

    const data = await testResult.findOne({
      applicationId,
      testType: { $in: ['ISHARA', 'ishihara'] }
    });

    if (!data) {
      return res.status(404).json({ message: 'Ishihara data not found' });
    }

    const doc = await generateIshiharaPdf(data);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename=ishihara-${applicationId}.pdf`
    );

    doc.pipe(res);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error generating PDF' });
  }
};