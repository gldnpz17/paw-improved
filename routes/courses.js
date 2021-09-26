import { Router } from 'express';
import CourseDtoMapper from '../mapper/course-dto-mapper.js';
import Course from '../schemas/course.js';
const coursesRouter = Router();

coursesRouter.post('/courses', async (req, res, next) => {
  try {
    let courseDocument = new Course(req.body)
    
    await courseDocument.save()

    let dto = CourseDtoMapper.mapToSimple(courseDocument.toObject())

    res.send(JSON.stringify(dto))
  } catch (err) {
    // pass errors (if any) into the error handler
    return next(err)
  }
})

coursesRouter.get('/courses', async (req, res, next) => {
  try {
    let keywords = req.query.keywords ?? null
    let start = req.query.start ? parseInt(req.query.start) : 0
    let count = req.query.count ? parseInt(req.query.count) : 1000
  
    let query;
    if (keywords) {
      query = Course.find({
        $text: {
          $search: keywords
        }
      })
    } else {
      query = Course.find()
    }
  
    let courseDocuments = await query.skip(start).limit(count).exec()
  
    let courses = courseDocuments.map(courseDocument => {
      return CourseDtoMapper.mapToSimple(courseDocument.toObject())
    })
  
    res.send(JSON.stringify(courses))
  } catch (err) {
    // pass errors (if any) into the error handler
    return next(err)
  }
  
})

coursesRouter.get('/courses/:code', async (req, res) => {
  let courseDocument = await Course.findOne({
    code: req.params.code
  }).exec()

  if (!courseDocument) {
    res.sendStatus(404)
  }

  let dto = CourseDtoMapper.mapToDetailed(courseDocument.toObject())

  res.send(JSON.stringify(dto))
})

coursesRouter.put('/courses/:code', async (req, res) => {
  let courseDocument = await Course.findOneAndUpdate({
    code: req.params.code
  }, req.body, { new: true }).exec()

  if (!courseDocument) {
    res.sendStatus(404)
  }

  let dto = CourseDtoMapper.mapToSimple(courseDocument.toObject())

  res.send(JSON.stringify(dto))
})

coursesRouter.delete('/courses/:code', async (req, res) => {
  let { deletedCount } = await Course.deleteOne({
    code: req.params.code
  }).exec()

  if (deletedCount === 0) {
    res.sendStatus(404)
  }

  res.send(JSON.stringify({
    success: true,
    deletedCount
  }))
})

export default coursesRouter;
