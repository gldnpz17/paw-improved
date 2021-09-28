import { Router } from 'express'
import loggingLevel from '../common/logging-level.js'
import { performance } from 'perf_hooks'
import { createHash } from 'crypto'
import routeHandlerErrorWrapper from '../common/route-handler-error-wrapper.js'

const AssignmentsRouter = (assignmentRepository, dtoMapper, cachingService = null, loggingService = null) => {
    const router = Router()

    router.post('/courses/:courseId/assignments', routeHandlerErrorWrapper(async (req, res) => {
        let assignment = await assignmentRepository.createAssignment(req.params.courseId, req.body)

        loggingService.log(loggingLevel.informational, `Assignment ${assignment.title} was created.`)

        let dto = dtoMapper.map(assignment)

        res.send(JSON.stringify(dto))
    }))

    router.get('/assignments', routeHandlerErrorWrapper(async (req, res) => {
        let queryStartTime = performance.now()

        let urlHash = createHash('md5').update(req.originalUrl).digest('base64')

        let dtos = await cachingService?.fetchCachedObject(`assignmentsearch:${urlHash}`)

        if (dtos) {
            let queryEndTime = performance.now()
            loggingService?.log(
                loggingLevel.informational, 
                `Assignments queried with cache hit. Query time: ${queryEndTime - queryStartTime} ms.`
            )
        } else {
            let keywords = req.query.keywords
            let start = req.query.start ? parseInt(req.query.start) : 0
            let count = req.query.count ? parseInt(req.query.count) : 1000   
            
            let assignments = await assignmentRepository.searchAssignments(keywords, start, count)

            dtos = assignments.map(dtoMapper.map)

            await cachingService?.cacheObject(`assignmentsearch:${urlHash}`, dtos, 10000)
        
            let queryEndTime = performance.now()
            loggingService?.log(
                loggingLevel.informational, 
                `Assignments queried with cache miss. Results cached. Query time: ${queryEndTime - queryStartTime} ms.`
            )
        }

        res.send(JSON.stringify(dtos))
    }))

    router.get('/assignments/:id', routeHandlerErrorWrapper(async (req, res) => {
        let queryStartTime = performance.now()

        let dto = await cachingService?.fetchCachedObject(`assignment:${req.params.id}`)

        if (dto) {
            let queryEndTime = performance.now()
            loggingService?.log(
                loggingLevel.informational, 
                `Assignment queried with cache hit. Query time: ${Math.round(queryEndTime - queryStartTime)} ms.`
            )
        } else {
            let assignment = await assignmentRepository.readAssignmentById(req.params.id)

            if (!assignment) {
                res.sendStatus(404)
                
                loggingService?.log(loggingLevel.informational, 'Assignment queried with no result.')
        
                return
            }

            dto = dtoMapper.map(assignment)

            await cachingService?.cacheObject(`assignment:${req.params.id}`, dto, 10000)
            
            let queryEndTime = performance.now()
            loggingService?.log(
                loggingLevel.informational, 
                `Assignment queried with cache miss. Result cached. Query time: ${Math.round(queryEndTime - queryStartTime)} ms.`
            )
        }

        res.send(JSON.stringify(dto))
    }))

    router.put('/assignments/:id', routeHandlerErrorWrapper(async (req, res) => {
        let assignment = await assignmentRepository.updateAssignment(req.params.id, req.body)

        if (!assignment) {
            res.sendStatus(404)

            loggingService?.log(loggingLevel.informational, `Assignment ${req.params.id} update attempted but document was not found.`)

            return
        }

        let dto = dtoMapper.map(assignment)

        loggingService?.log(
            loggingLevel.informational, 
            `Assignment ${req.params.id} was updated.`
        )

        res.send(JSON.stringify(dto))
    }))

    router.delete('/assignments/:id', routeHandlerErrorWrapper(async (req, res) => {
        let assignment = await assignmentRepository.deleteAssignment(req.params.id)

        if (!assignment) {
            res.sendStatus(404)

            loggingService?.log(
                loggingLevel.informational, 
                `Assignment ${req.params.id} delete attempted but document was not found.`
            )

            return
        }
        
        let dto = dtoMapper.map(assignment)

        loggingService?.log(
            loggingLevel.informational, 
            `Assignment ${req.params.id} was deleted.`
        )

        res.send(JSON.stringify(dto))
    }))

    return router
}

export default AssignmentsRouter