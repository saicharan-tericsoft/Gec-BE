"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disclaimerStudentInfo = void 0;
const model_1 = require("./model");
const disclaimerStudentInfo = async (name, age, sex, applicationId) => {
    try {
        const user = await model_1.User.findOneAndUpdate({
            applicationId: applicationId
        }, {
            $set: {
                age: age,
                sex: sex
            }
        }, {});
        return user;
    }
    catch (error) {
        console.error(error);
        throw new Error("Failed to save student information");
    }
};
exports.disclaimerStudentInfo = disclaimerStudentInfo;
