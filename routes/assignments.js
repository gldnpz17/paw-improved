import { Router } from 'express';
import AssignmentDtoMapper from '../mapper/assignment-dto-mapper.js';
import Assignment from '../schemas/assignment.js';
const assignmentsRouter = Router();

assignmentsRouter.post('/courses/:id/assignments', async (req, res, next) => {
    try {
        let assignmentDocument = new Assignment(req.body)
        
        await assignmentDocument.save()

        let dto = AssignmentDtoMapper.map(assignmentDocument.toObject())

        res.send(JSON.stringify(dto))
    } catch (err) {
        // pass errors (if any) into the error handler
        return next(err)
    }
})

assignmentsRouter.get('/courses/:id/assignments', async (req, res, next) => {
    try {
        let count = req.query.count ? parseInt(req.query.count) : 1000

        let query = Assignment.find()

        let assignmentDocuments = await query.limit(count).exec()

        let assignments = assignmentDocuments.map(assignmentDocument => {
            return AssignmentDtoMapper.map(assignmentDocument.toObject())
        })

        res.send(JSON.stringify(assignments))
    }
    catch (err) {
        // pass errors (if any) into the error handler
        return next(err)
    }
})

assignmentsRouter.get('/courses/:id/assignments/:id', async (req, res) => {
    let assignmentDocument = await Assignment.findOne({
        code: req.params.code
    }).exec()

    if (!assignmentDocument) {
    res.sendStatus(404)
    }

    let dto = AssignmentDtoMapper.map(assignmentDocument.toObject())

    res.send(JSON.stringify(dto))
})

assignmentsRouter.put('/courses/:id/assignments/:id', async (req, res) => {
    let assignmentDocument = await Assignment.findOne({
        code: req.params.code
    }, req.body, { new: true }).exec()

    if (!assignmentDocument) {
    res.sendStatus(404)
    }

    let dto = AssignmentDtoMapper.map(assignmentDocument.toObject())

    res.send(JSON.stringify(dto))
})

assignmentsRouter.delete('/courses/:id/assignments/:id', async (req, res) => {
    let { deletedCount } = await Assignment.deleteOne({
      code: req.params.code
    }).exec()
  
    if (deletedCount === 0) {
      res.sendStatus(404)
    }
  
    res.send(JSON.stringify({
      success: true,
      deletedCount
    }))
})

export default assignmentsRouter;