import Course from '../schemas/course.js'
import Assignment from '../schemas/assignment.js'
import { Types } from 'mongoose';

class AssignmentRepository {
    async createAssignment(courseId, assignment) {
        let course = await Course.findById(courseId).exec();
            
        course.assignments.push(new Assignment({
            ...assignment,
            course: Types.ObjectId(courseId)
        }))

        await course.save()

        return course.toObject()
    }

    async readAssignmentById(id) {
        let course = await Course.findOne({
            'assignments._id': Types.ObjectId(id)
        }).exec()

        if (!course) {
            res.sendStatus(404)
        }

        let assignment = course.assignments.id(id)

        return assignment.toObject()
    }

    async searchAssignments(keywords, start, count) {
        let assignments = await Course
            .aggregate()
            .unwind('$assignments')
            .replaceRoot('$assignments')
            .skip(start)
            .limit(count)
            .exec()

        return assignments
    }

    async updateAssignment(id, assignment) {
        let course = await Course
            .findOneAndUpdate({
                'assignments._id': Types.ObjectId(id)
            }, {    
                $set: {
                    'assignments.$': {
                        ...assignment,
                        _id: Types.ObjectId(id)
                    }
                }
            }, { new: true })
            .exec()

        if (!course) {
            return null
        }

        let assignmentDocument = course.assignments.id(req.params.assignmentId)

        return assignmentDocument.toObject()
    }

    async deleteAssignment(id) {
        let course = await Course.findOne({
            'assignments._id': Types.ObjectId(id)
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