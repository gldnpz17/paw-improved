import express from 'express'
import path, { dirname } from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import applicationConfig from './configuration/application-config.js'
import CoursesRouterBuilder from './routes/courses.js'
import assignmentsRouter from './routes/assignments.js'
import mongoose from 'mongoose'
import { fileURLToPath } from 'url'
import CourseRepository from './repositories/course-repository.js'
import CourseDtoMapper from './mapper/course-dto-mapper.js'
import ConsoleLogger from './services/console-logger.js'
import RedisCachingService from './services/redis-caching-service.js'
import DiscordLogger from './services/discord-logger.js'
import loggingLevel from './common/logging-level.js'

mongoose.connect(applicationConfig.mongodbConnection)

const app = express()

// Configure services.
let loggerService = null
switch (applicationConfig.loggerType) {
    case 'Discord':
    loggerService = new DiscordLogger(applicationConfig)
    break
    default:
    loggerService = new ConsoleLogger()
    break
}
let cachingService = new RedisCachingService(applicationConfig)

// Configure middlewares.
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(dirname(fileURLToPath(import.meta.url)), 'public')))

// API Router Configurations.
const configureCoursesRouter = () => {
    let repository = new CourseRepository()
    
    let router = new CoursesRouterBuilder(applicationConfig, repository, CourseDtoMapper)
    .setLogging(loggerService)
    .setCaching(cachingService)
    .build()
    
    return router
}

// Set API routes.
app.use('/api', configureCoursesRouter())
app.use('/api', assignmentsRouter)

// Start server.
app.listen(applicationConfig.port, () => {
    console.log(`Server started. Listening on port ${applicationConfig.port}.`)
})

export default app