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
      let document = await this.repository.createCourse(req.body)

      let dto = this.dtoMapper.mapToSimple(document.toObject())

      this.loggerService?.log(loggingLevel.informational, `Course ${dto.code} created.`)

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
        
        let documents = await this.repository.searchCourses(keywords, start, count)
  
        dtos = documents.map(document => {
          return this.dtoMapper.mapToSimple(document.toObject())
        })

        await this.cachingService?.cacheObject(`coursesearch:${urlHash}`, dtos, 10000)

        let queryEndTime = performance.now()
        this.loggerService?.log(
          loggingLevel.informational, 
          `Courses queried with cache miss. Results cached. Query time: ${queryEndTime - queryStartTime} ms.`
        )
      }

      res.send(JSON.stringify(dtos))
    })

    coursesRouter.get('/courses/:code', async (req, res) => {
      let queryStartTime = performance.now()

      // Try fetch from cache.
      let dto = await this.cachingService?.fetchCachedObject(`course:${req.params.code}`)

      if (dto) {
        let queryEndTime = performance.now()
        this.loggerService?.log(
          loggingLevel.informational, 
          `Course queried with cache hit. Query time: ${queryEndTime - queryStartTime} ms.`
        )
      } else {
        // Fetch from database and save to cache.
        let document = await this.repository.readCourse(req.params.code)

        dto = this.dtoMapper.mapToDetailed(document.toObject())

        await this.cachingService?.cacheObject(`course:${req.params.code}`, dto, 10000)

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

    coursesRouter.put('/courses/:code', async (req, res) => {
      let document = await this.repository.updateCourse(req.params.code, req.body)

      if (!document) {
        res.sendStatus(404)

        return
      }

      let dto = this.dtoMapper.mapToSimple(document.toObject())

      this.loggerService?.log(loggingLevel.informational, `Course ${dto.code} updated.`)

      res.send(JSON.stringify(dto))
    })

    coursesRouter.delete('/courses/:code', async (req, res) => {
      let deletedCount = await this.repository.deleteCourse(req.params.code)

      if (deletedCount === 0) {
        res.sendStatus(404)

        return
      }

      this.loggerService?.log(loggingLevel.informational, `Course ${req.params.code} deleted.`)

      res.send(JSON.stringify({
        success: true
      }))
    })

    return coursesRouter
  }
}

export default CoursesRouterBuilder;
