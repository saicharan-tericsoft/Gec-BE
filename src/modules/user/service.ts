import { User } from "./model";

export const disclaimerStudentInfo = async (name: string, age: number, sex: string, applicationId: string) => {
    
    try {
        const user = await User.findOneAndUpdate({
        applicationId: applicationId
    },{
        $set: {
        age: age,
        sex: sex
        }
    },
{

});
return user;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to save student information");
    }
};