import Course from "../schemas/course.js"

class CourseReporitory {
    async createCourse(course) {
        let newCourse = new Course(course)
        
        await newCourse.save()
        
        return newCourse.toObject()
    }
    
    async readCourse(id) {
        return await Course
            .findById(id)
            .lean()
            .exec()
    }
    
    async searchCourses(keywords, start, count) {
        let query = {};
        
        if (keywords) {
            query = {
                ...query,
                $text: {
                    $search: keywords
                }
            }
        }
        
        return await Course
            .find(query)
            .skip(start)
            .limit(count)
            .lean()
            .exec()
    }
    
    async updateCourse(id, course) {
        return await Course
            .findByIdAndUpdate(id, course, { new: true })
            .lean()
            .exec()
    }
    
    async deleteCourse(id) {
        return await Course
            .findByIdAndDelete(id)
            .lean()
            .exec()
    }
}

export default CourseReporitory