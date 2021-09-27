const CourseDtoMapper = {
    mapToSimple: (course) => {
        let { _id, __v, assignments, ...courseFields } = course
        
        return {
            id: _id,
            ...courseFields
        }
    },
    mapToDetailed: (course) => {
        let { _id, __v, ...courseFields } = course
        
        courseFields.lms = courseFields.lms.map(LmsDtoMapper.map)
        
        return {
            id: _id,
            ...courseFields
        }
    }
}

export default CourseDtoMapper