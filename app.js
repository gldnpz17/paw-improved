import express from 'express'
import path, { dirname } from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import applicationConfig from './configuration/application-config.js'
import CoursesRouterBuilder from './routes/courses.js'
import mongoose from 'mongoose'
import { fileURLToPath } from 'url'
import CourseRepository from './repositories/course-repository.js'
import CourseDtoMapper from './mapper/course-dto-mapper.js'
import ConsoleLogger from './services/console-logger.js'

mongoose.connect(applicationConfig.mongodbConnection)

const app = express()

// Configure middlewares.
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(dirname(fileURLToPath(import.meta.url)), 'public')))

// API Router Configurations.
const configureCoursesRouter = () => {
  let repository = new CourseRepository()

  let builder = new CoursesRouterBuilder(applicationConfig, repository, CourseDtoMapper)

  builder.setLogger(new ConsoleLogger())

  return builder.build()
}

// Set API routes.
app.use('/api', configureCoursesRouter())

// Start server.
app.listen(applicationConfig.port, () => {
  console.log(`Server started. Listening on port ${applicationConfig.port}.`)
})

export default app