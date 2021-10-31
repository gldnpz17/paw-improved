import mongoose from 'mongoose'

export const assignmentSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    }
})

const Assignment = mongoose.model('Assignment', assignmentSchema)

export default Assignment
