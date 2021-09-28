import { Router } from 'express';
import loggingLevel from '../common/logging-level.js'
import { performance } from 'perf_hooks'
import { createHash } from 'crypto'
import routeHandlerErrorWrapper from '../common/route-handler-error-wrapper.js'

const CoursesRouter = (courseRepository, dtoMapper, cachingService = null, loggingService = null) => {
    const router = Router();
    
    router.post('/courses', routeHandlerErrorWrapper(async (req, res) => {
        let course = await courseRepository.createCourse(req.body)
        
        let dto = dtoMapper.mapToSimple(course)
        
        loggingService?.log(loggingLevel.informational, `Course ${dto.code} successfully created.`)
        
        res.statusCode = 201
        res.send(JSON.stringify(dto))
    }))
    
    router.get('/courses', routeHandlerErrorWrapper(async (req, res) => {
        let queryStartTime = performance.now()
        
        let urlHash = createHash('md5').update(req.originalUrl).digest('base64')
        
        let dtos = await cachingService?.fetchCachedObject(`coursesearch:${urlHash}`)
        
        if (dtos) {
            let queryEndTime = performance.now()
            loggingService?.log(
                loggingLevel.informational, 
                `Courses queried with cache hit. Query time: ${Math.round(queryEndTime - queryStartTime)} ms.`
            )
        } else {
            let keywords = req.query.keywords ?? null
            let start = req.query.start ? parseInt(req.query.start) : 0
            let count = req.query.count ? parseInt(req.query.count) : 1000
            
            let courses = await courseRepository.searchCourses(keywords, start, count)
            
            dtos = courses.map(dtoMapper.mapToSimple)
            
            await cachingService?.cacheObject(`coursesearch:${urlHash}`, dtos, 10000)
            
            let queryEndTime = performance.now()
            loggingService?.log(
                loggingLevel.informational, 
                `Courses queried with cache miss. Results cached. Query time: ${Math.round(queryEndTime - queryStartTime)} ms.`
            )
        }
            
        res.send(JSON.stringify(dtos))
    }))
            
    router.get('/courses/:id', routeHandlerErrorWrapper(async (req, res) => {
        let queryStartTime = performance.now()
        
        let dto = await cachingService?.fetchCachedObject(`course:${req.params.id}`)
        
        if (dto) {
            let queryEndTime = performance.now()
            loggingService?.log(
                loggingLevel.informational, 
                `Course queried with cache hit. Query time: ${Math.round(queryEndTime - queryStartTime)} ms.`
            )
        } else {
            let course = await courseRepository.readCourse(req.params.id)

            if (!course) {
                res.sendStatus(404)
                
                loggingService?.log(
                    loggingLevel.informational, 
                    'Course queried with no result.'
                )
        
                return
            }
                
            dto = dtoMapper.mapToDetailed(course)
            
            await cachingService?.cacheObject(`course:${req.params.id}`, dto, 10000)
            
            let queryEndTime = performance.now()
            loggingService?.log(
                loggingLevel.informational, 
                `Course queried with cache miss. Result cached. Query time: ${Math.round(queryEndTime - queryStartTime)} ms.`
            )
        }
                    
        res.send(JSON.stringify(dto))
    }))
                
    router.put('/courses/:id', routeHandlerErrorWrapper(async (req, res) => {
        let course = await courseRepository.updateCourse(req.params.id, req.body)
        
        if (!course) {
            res.sendStatus(404)
            
            return
        }
        
        let dto = dtoMapper.mapToSimple(course)
            
        loggingService?.log(loggingLevel.informational, `Course ${dto.code}(id: ${dto.id}) successfully updated.`)
        
        res.send(JSON.stringify(dto))
    }))

    router.delete('/courses/:id', routeHandlerErrorWrapper(async (req, res) => {
        let course = await courseRepository.deleteCourse(req.params.id)
        
        if (!course) {
            res.sendStatus(404)
    
            return
        }

        let dto = dtoMapper.mapToSimple(course)
                    
        loggingService?.log(loggingLevel.informational, `Course ${req.params.id} successfully deleted.`)
        
        res.send(JSON.stringify(dto))
    }))
                        
    return router
}
                    
export default CoursesRouter;
            