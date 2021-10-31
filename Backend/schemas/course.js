import mongoose from 'mongoose'
import { assignmentSchema } from './assignment.js'

const courseSchema = mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    assignments: [assignmentSchema]
})

courseSchema.pre('findOneAndUpdate', function(next) {
    this.options.runValidators = true
    next()
})

courseSchema.pre('findByIdAndUpdate', function(next) {
    this.options.runValidators = true
    next()
})

courseSchema.index({
    code: 'text',
    name: 'text',
    'assignments.title': 'text',
    'assignments.details': 'text'
})

const Course = mongoose.model('Course', courseSchema)

export default Course