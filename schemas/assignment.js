import mongoose from 'mongoose'

export const assignmentSchema = mongoose.Schema({
  title: String,
  details: String,
  deadline: Date  
})

assignmentSchema.index({
  title: 'text',
  details: 'text'
})

const Assignment = mongoose.model('Assignment', assignmentSchema)

export default Assignment