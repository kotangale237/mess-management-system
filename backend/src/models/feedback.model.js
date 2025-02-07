import mongoose, {Schema} from "mongoose";

const feedbackSchema = new Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Student', 
            required: true 
        },
        mealType: { 
            type: String, 
            enum: ['breakfast', 'lunch', 'dinner'], 
            required: true 
        },
        rating: { 
            type: Number, 
            min: 1, 
            max: 5, 
            required: true 
        },
        comment: {
            type: String 
        },
        blockchainTransactionHash: {
            type: String, 
            required: false 
        },
        createdAt: { 
            type: Date, 
            default: Date.now 
        },
    }, 
    {
    timestamps: true
    }
)



export const Feedback = mongoose.model("Feedback", feedbackSchema)