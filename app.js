import express from 'express'
import path, { dirname } from 'path'
import cookieParser from 'cookie-parser'
import applicationConfig from './configuration/application-config.js'
import CoursesRouterBuilder from './routes/courses.js'
import mongoose from 'mongoose'
import { fileURLToPath } from 'url'
import CourseRepository from './repositories/course-repository.js'
import CourseDtoMapper from './mapper/course-dto-mapper.js'
import ConsoleLogger from './services/console-logger.js'
import RedisCachingService from './services/redis-caching-service.js'
import DiscordLogger from './services/discord-logger.js'
import AssignmentRepository from './repositories/assignment-repository.js'
import AssignmentsRouterBuilder from './routes/assignments.js'
import AssignmentDtoMapper from './mapper/assignment-dto-mapper.js'

mongoose.connect(applicationConfig.mongodbConnection)

const app = express()

// Configure services and repositories.
let loggingService = null
switch (applicationConfig.loggerType) {
    case 'Discord':
        loggingService = new DiscordLogger(applicationConfig)
        break
    case 'Console':
        loggingService = new ConsoleLogger()
    default:
        console.warn('Logger not configured.')
        break
}
let cachingService = new RedisCachingService(applicationConfig)
let courseRepository = new CourseRepository()
let assignmentRepository = new AssignmentRepository()

// Configure middlewares.
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(dirname(fileURLToPath(import.meta.url)), 'public')))

// Set API routes.
app.use(
    '/api', 
    new CoursesRouterBuilder(applicationConfig, courseRepository, CourseDtoMapper)
        .setLogging(loggingService)
        .setCaching(cachingService)
        .build()
)
app.use(
    '/api', 
    new AssignmentsRouterBuilder(applicationConfig, assignmentRepository, AssignmentDtoMapper)
        .setLogging(loggingService)
        .setCaching(cachingService)
        .build()
)

// Start server.
app.listen(applicationConfig.port, () => {
    console.log(`Server started. Listening on port ${applicationConfig.port}.`)
})

export default app