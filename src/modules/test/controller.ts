import { Request, Response } from "express";
import { testResult } from "./model";
import { User } from "../user/model";

export const submitTest = async (req: Request, res: Response) => {
  try {
    const { applicationId, testType, responses, result, patient } = req.body;

    if (!applicationId || !testType) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    const { name, age, sex } = await User.findOne({ applicationId }) || {};
    const saved = await testResult.findOneAndUpdate(
      { applicationId, testType },
      {
      applicationId,
      testType,
      responses,
      result,
      patient,
      name,
      age,
      sex
    },
      { upsert: true, new: true });

    return res.status(201).json({
      message: 'Test submitted successfully',
      data: saved
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const firstTime = async (req: Request, res: Response) => {
  try {
    const { applicationId, route } = req.params;
    const existingTest = await testResult.findOne({ applicationId, testType: route });

    if (existingTest) {
      return res.json({ firstTime: false });
    } else {
      return res.json({ firstTime: true });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}