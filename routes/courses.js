import { Router } from 'express';
import loggingLevel from '../common/logging-level.js'
import { performance } from 'perf_hooks'
import { createHash } from 'crypto'

class CoursesRouterBuilder {
    constructor(configuration, courseRepository, dtoMapper) {
        this.configuration = configuration
        this.repository = courseRepository
        this.dtoMapper = dtoMapper
    }
    
    setCaching(cachingService) {
        this.cachingService = cachingService
        
        return this
    }
    
    setLogging(loggerService) {
        this.loggerService = loggerService
        
        return this
    }
    
    build() {
        const coursesRouter = Router();
        
        coursesRouter.post('/courses', async (req, res) => {
            let course = await this.repository.createCourse(req.body)
            
            let dto = this.dtoMapper.mapToSimple(course)
            
            this.loggerService?.log(loggingLevel.informational, `Course ${dto.code} successfully created.`)
            
            res.send(JSON.stringify(dto))
        })
        
        coursesRouter.get('/courses', async (req, res) => {
            let queryStartTime = performance.now()
            
            let urlHash = createHash('md5').update(req.originalUrl).digest('base64')
            
            let dtos = await this.cachingService?.fetchCachedObject(`coursesearch:${urlHash}`)
            
            if (dtos) {
                let queryEndTime = performance.now()
                this.loggerService?.log(
                    loggingLevel.informational, 
                    `Courses queried with cache hit. Query time: ${queryEndTime - queryStartTime} ms.`
                )
            } else {
                let keywords = req.query.keywords ?? null
                let start = req.query.start ? parseInt(req.query.start) : 0
                let count = req.query.count ? parseInt(req.query.count) : 1000
                
                let courses = await this.repository.searchCourses(keywords, start, count)
                
                dtos = courses.map(this.dtoMapper.mapToSimple)
                
                await this.cachingService?.cacheObject(`coursesearch:${urlHash}`, dtos, 10000)
                
                let queryEndTime = performance.now()
                this.loggerService?.log(
                    loggingLevel.informational, 
                    `Courses queried with cache miss. Results cached. Query time: ${queryEndTime - queryStartTime} ms.`
                )
            }
                
            res.send(JSON.stringify(dtos))
        })
                
        coursesRouter.get('/courses/:id', async (req, res) => {
            let queryStartTime = performance.now()
            
            // Try fetch from cache.
            let dto = await this.cachingService?.fetchCachedObject(`course:${req.params.id}`)
            
            if (dto) {
                let queryEndTime = performance.now()
                this.loggerService?.log(
                    loggingLevel.informational, 
                    `Course queried with cache hit. Query time: ${queryEndTime - queryStartTime} ms.`
                )
            } else {
                // Fetch from database and save to cache.
                let course = await this.repository.readCourse(req.params.id)
                    
                dto = this.dtoMapper.mapToDetailed(course)
                
                await this.cachingService?.cacheObject(`course:${req.params.id}`, dto, 10000)
                
                let queryEndTime = performance.now()
                this.loggerService?.log(
                    loggingLevel.informational, 
                    `Course queried with cache miss. Result cached. Query time: ${queryEndTime - queryStartTime} ms.`
                )
            }
                    
            if (!dto) {
                res.sendStatus(404)
                
                this.loggerService?.log(
                    loggingLevel.informational, 
                    'Course queried with no results.'
                )
        
                return
            }
                        
            res.send(JSON.stringify(dto))
        })
                    
        coursesRouter.put('/courses/:id', async (req, res) => {
            let course = await this.repository.updateCourse(req.params.id, req.body)
            
            if (!course) {
                res.sendStatus(404)
                
                return
            }
            
            let dto = this.dtoMapper.mapToSimple(course)
                
            this.loggerService?.log(loggingLevel.informational, `Course ${dto.code}(id: ${dto.id}) successfully updated.`)
            
            res.send(JSON.stringify(dto))
        })

        coursesRouter.delete('/courses/:id', async (req, res) => {
            let course = await this.repository.deleteCourse(req.params.id)
            
            if (!course) {
                res.sendStatus(404)
        
                return
            }

            let dto = this.dtoMapper.mapToSimple(course)
                        
            this.loggerService?.log(loggingLevel.informational, `Course ${req.params.id} successfully deleted.`)
            
            res.send(JSON.stringify(dto))
        })
                            
        return coursesRouter
    }
}
                    
export default CoursesRouterBuilder;
            
