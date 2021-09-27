import { Router } from 'express';
import mongoose from 'mongoose';
import AssignmentDtoMapper from '../mapper/assignment-dto-mapper.js';
import Assignment from '../schemas/assignment.js';
import Course from '../schemas/course.js';
const assignmentsRouter = Router();

assignmentsRouter.post('/courses/:courseId/assignments', async (req, res, next) => {
    try {
        let course = await Course.findById(req.params.courseId).exec();
        
        course.assignments.push(new Assignment({
            ...req.body,
            course: req.params.courseId
        }))

        await course.save()

        let dto = AssignmentDtoMapper.map(course.toObject())

        res.send(JSON.stringify(dto))
    } catch (err) {
        // pass errors (if any) into the error handler
        return next(err)
    }
})

assignmentsRouter.get('/assignments', async (req, res, next) => {
    try {
        let start = req.query.start ? parseInt(req.query.start) : 0
        let count = req.query.count ? parseInt(req.query.count) : 1000

        let assignments = await Course
            .aggregate()
            .unwind('$assignments')
            .replaceRoot('$assignments')
            .skip(start)
            .limit(count)
            .exec()
        
        let dtos = assignments.map(AssignmentDtoMapper.map)

        res.send(JSON.stringify(dtos))
    }
    catch (err) {
        // pass errors (if any) into the error handler
        return next(err)
    }
})

assignmentsRouter.get('/courses/:courseId/assignments/:assignmentId', async (req, res) => {
    let course = await Course.findById(req.params.courseId).exec()
    
    let assignment = course.assignments.id(req.params.assignmentId).toObject()

    if (!assignment) {
        res.sendStatus(404)
    }

    let dto = AssignmentDtoMapper.map(assignment)

    res.send(JSON.stringify(dto))
})

assignmentsRouter.put('/assignments/:assignmentId', async (req, res) => {
    let course = await Course
        .findOneAndUpdate({
            'assignments._id': mongoose.Types.ObjectId(req.params.assignmentId)
        }, {    
            $set: {
                'assignments.$': {
                    ...req.body,
                    _id: req.params.assignmentId
                }
            }
        }, { new: true })
        .exec()

    if (!course) {
        res.sendStatus(404)

        return
    }

    console.log(course.toObject())

    let assignment = course.assignments.id(req.params.assignmentId)

    let dto = AssignmentDtoMapper.map(assignment.toObject())

    res.send(JSON.stringify(dto))
})

assignmentsRouter.delete('/assignments/:assignmentId', async (req, res) => {
    let course = await Course.findOne({
        'assignments._id': mongoose.Types.ObjectId(req.params.assignmentId)
    }).exec()

    let assignmentDocument = course.assignments.id(req.params.assignmentId)
  
    if (!assignmentDocument) {
        res.sendStatus(404)
    }

    let assignment = assignmentDocument.toObject()
    assignmentDocument.remove()

    await course.save()
  
    let dto = AssignmentDtoMapper.map(assignment)

    res.send(JSON.stringify(dto))
})

export default assignmentsRouter;