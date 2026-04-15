import { Request, Response } from "express";
import * as userService from "./service";
import { User } from "./model";

export const disclaimerStudentInfo = async (req: Request, res: Response) => {

    try {
        const { name, age, sex, applicationId } =req.body;
        await userService.disclaimerStudentInfo(name, age, sex, applicationId);
        res.status(200).json({ message: "Student information saved successfully" });
    } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
}
};