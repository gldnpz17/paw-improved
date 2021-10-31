import AssignmentDtoMapper from './assignment-dto-mapper.js'

const CourseDtoMapper = {
    mapToSimple: (course) => {
        let { _id, __v, assignments, ...courseFields } = course
        
        return {
            id: _id,
            ...courseFields
        }
    },
    mapToDetailed: (course) => {
        let { _id, __v, assignments, ...courseFields } = course
        
        assignments = assignments.map(AssignmentDtoMapper.map)
        
        return {
            id: _id,
            ...courseFields,
            assignments
        }
    }
}

export default CourseDtoMapper