import Course from "../schemas/course.js"

class CourseReporitory {
  async createCourse(course) {
    let courseDocument = new Course(course)

    await courseDocument.save()

    return courseDocument
  }

  async readCourse(courseCode) {
    let courseDocument = await Course.findOne({
      code: courseCode
    }).exec()

    return courseDocument
  }

  async searchCourse(keywords, start, count) {
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

    return courseDocuments
  }

  async updateCourse(courseCode, course) {
    let courseDocument = await Course.findOneAndUpdate({
      code: courseCode
    }, course, { new: true }).exec()

    return courseDocument
  }

  async deleteCourse(courseCode) {
    let { deletedCount } = await Course.deleteOne({
      code: req.params.code
    }).exec()

    return deletedCount
  }
}

export default CourseReporitory