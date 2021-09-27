import { Router } from 'express';
import mongoose from 'mongoose';
import AssignmentDtoMapper from '../mapper/assignment-dto-mapper.js';
import Assignment from '../schemas/assignment.js';
import Course from '../schemas/course.js';

class AssignmentsRouterBuilder {
    constructor(configuration, assignmentRepository, dtoMapper) {
        this.configuration = configuration
        this.repository = assignmentRepository
        this.dtoMapper = dtoMapper
    }

    setCaching(cachingService) {
        this.cachingService = cachingService

        return this
    }

    setLogging(loggingService) {
        this.loggingService = loggingService

        return this
    }

    build() {
        const router = Router();

        router.post('/courses/:courseId/assignments', async (req, res, next) => {
            try {
                let course = await this.repository.createAssignment(req.params.courseId, req.body)

                let dto = AssignmentDtoMapper.map(course)

                res.send(JSON.stringify(dto))
            } catch (err) {
                // pass errors (if any) into the error handler
                return next(err)
            }
        })

        router.get('/assignments', async (req, res, next) => {
            try {
                let keywords = req.query.keywords
                let start = req.query.start ? parseInt(req.query.start) : 0
                let count = req.query.count ? parseInt(req.query.count) : 1000        
                
                let assignments = await this.repository.searchAssignments(keywords, start, count)

                let dtos = assignments.map(AssignmentDtoMapper.map)

                res.send(JSON.stringify(dtos))
            }
            catch (err) {
                // pass errors (if any) into the error handler
                return next(err)
            }
        })

        router.get('/assignments/:id', async (req, res) => {
            let assignment = await this.repository.readAssignmentById(req.params.id)

            let dto = AssignmentDtoMapper.map(assignment)

            res.send(JSON.stringify(dto))
        })

        router.put('/assignments/:id', async (req, res) => {
            let assignment = await this.repository.updateAssignment(req.params.id, req.body)

            if (!assignment) {
                res.sendStatus(404)

                return
            }

            let dto = AssignmentDtoMapper.map(assignment)

            res.send(JSON.stringify(dto))
        })

        router.delete('/assignments/:id', async (req, res) => {
            let assignment = await this.repository.deleteAssignment(req.params.id)

            if (!assignment) {
                res.sendStatus(404)

                return
            }
            
            let dto = AssignmentDtoMapper.map(assignment)

            res.send(JSON.stringify(dto))
        })

        return router
    }
}

export default AssignmentsRouterBuilder