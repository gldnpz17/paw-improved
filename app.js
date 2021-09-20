import express from 'express'
import path, { dirname } from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import applicationConfig from './configuration/application-config.js'
import coursesRouter from './routes/courses.js'
import mongoose from 'mongoose'
import { fileURLToPath } from 'url'

mongoose.connect(applicationConfig.mongodbConnection)

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(dirname(fileURLToPath(import.meta.url)), 'public')))

app.use('/api', coursesRouter)

app.listen(applicationConfig.port, () => {
  console.log(`Server started. Listening on port ${applicationConfig.port}.`)
})

export default app
