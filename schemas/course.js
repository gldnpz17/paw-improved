import mongoose from 'mongoose'

const courseSchema = mongoose.Schema({
    code: String,
    name: String,
    lms: [{
        name: String,
        url: String
    }],
    assignments: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assignment' 
    }]
})

courseSchema.index({
    code: 'text',
    name: 'text',
    'lms.name': 'text'
})

const Course = mongoose.model('Course', courseSchema)

export default Course