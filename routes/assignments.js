import { Router } from 'express';
import Assignment from '../schemas/assignment';
const assignmentsRouter = Router();

assignmentsRouter.post('/courses/assignments', async (req, res, next) => {
    try {
        let assignmentDocument = new Assignment(req.body)
        
        await assignmentDocument.save()

        res.send('Assignment succesfully added')
    } catch (err) {
        // pass errors (if any) into the error handler
        return next(err)
    }
})

assignmentsRouter.get('/courses/assignments', async (req, res) => {
    let count = req.query.count ? parseInt(req.query.count) : 1000

    try {
        let query = Assignment.find()

        let assignments = await query.limit(count).exec()

        res.send(JSON.stringify(assignments))
    }
    catch (err) {
        // pass errors (if any) into the error handler
        return next(err)
    }
})

export default assignmentsRouter;