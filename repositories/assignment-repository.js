import Course from '../schemas/course.js'
import Assignment from '../schemas/assignment.js'
import mongoose from 'mongoose';

class AssignmentRepository {
    async createAssignment(courseId, assignment) {
        let course = await Course.findById(courseId).exec();
            
        let newAssignment = new Assignment({
            ...assignment,
            course: mongoose.Types.ObjectId(courseId)
        })

        course.assignments.push(newAssignment)

        await course.save()

        return newAssignment.toObject()
    }

    async readAssignmentById(id) {
        let course = await Course.findOne({
            'assignments._id': mongoose.Types.ObjectId(id)
        }).exec()

        if (!course) {
            res.sendStatus(404)
        }

        let assignment = course.assignments.id(id)

        return assignment.toObject()
    }

    async searchAssignments(keywords, start, count) {
        let query = {}

        if (keywords) {
            let searchRegex = keywords.split(' ').map(keyword => `(${keyword})`).join('|')

            query = {
                ...query,
                $or: [
                    {
                        title: { $regex: searchRegex, $options: 'i' } 
                    },
                    {
                        details: { $regex: searchRegex, $options: 'i' } 
                    }
                ]
            }
        }

        let assignments = await Course
            .aggregate()
            .unwind('$assignments')
            .replaceRoot('$assignments')
            .match(query)
            .skip(start)
            .limit(count)
            .exec()

        return assignments
    }

    async updateAssignment(id, assignment) {
        let course = await Course
            .findOneAndUpdate({
                'assignments._id': mongoose.Types.ObjectId(id)
            }, {    
                $set: {
                    'assignments.$': {
                        ...assignment,
                        _id: mongoose.Types.ObjectId(id)
                    }
                }
            }, { new: true })
            .exec()

        if (!course) {
            return null
        }

        let assignmentDocument = course.assignments.id(id)

        return assignmentDocument.toObject()
    }

    async deleteAssignment(id) {
        let course = await Course.findOne({
            'assignments._id': mongoose.Types.ObjectId(id)
        }).exec()

        if (!course) {
            return null
        }

        let assignmentDocument = course.assignments.id(id)

        let assignment = assignmentDocument.toObject()
        assignmentDocument.remove()

        await course.save()

        return assignment
    }
}

export default AssignmentRepository