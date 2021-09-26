import { Router } from 'express';
import loggingLevel from '../common/logging-level.js'

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

  setLogger(loggerService) {
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
      let keywords = req.query.keywords ?? null
      let start = req.query.start ? parseInt(req.query.start) : 0
      let count = req.query.count ? parseInt(req.query.count) : 1000
      
      let documents = await this.repository.searchCourses(keywords, start, count)

      let courses = documents.map(document => {
        return this.dtoMapper.mapToSimple(document.toObject())
      })

      res.send(JSON.stringify(courses))
    })

    coursesRouter.get('/courses/:code', async (req, res) => {
      let document = await this.repository.readCourse(req.params.code)

      if (!document) {
        res.sendStatus(404)

        return
      }

      let dto = this.dtoMapper.mapToDetailed(document.toObject())

      this.loggerService?.log(loggingLevel.informational, `Course ${dto.code} updated.`)

      res.send(JSON.stringify(dto))
    })

    coursesRouter.put('/courses/:code', async (req, res) => {
      let document = await this.repository.updateCourse(req.params.code, req.body)

      if (!document) {
        res.sendStatus(404)

        return
      }

      let dto = this.dtoMapper.mapToSimple(courseDocument.toObject())

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
