import { Student } from "../models/student.model.js";

export const rewardStudentWithFoodByte = async (rollno) => {
    const student = await Student.findOne({ rollno });
    if (student) {
        student.foodByte = (student.foodByte || 0) + 1;
        await student.save();
    }
};
