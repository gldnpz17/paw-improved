import express from 'express'
import path, { dirname } from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import applicationConfig from './configuration/application-config.js'
import indexRouter from './routes/index.js'
import usersRouter from './routes/users.js'
import coursesRouter from './routes/courses.js'
import mongoose from 'mongoose'

mongoose.connect(applicationConfig.mongodbConnection)

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(dirname(import.meta.url), 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/api', coursesRouter)

app.listen(applicationConfig.port, () => {
  console.log(`Server started. Listening to port ${applicationConfig.port}.`)
})

export default app
