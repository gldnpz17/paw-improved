const AssignmentDtoMapper = {
    map: (assignment) => {
        let { _id, __v, ...assignmentFields } = assignment
        
        return {
            id: _id,
            ...assignmentFields
        }
    }
}

export default AssignmentDtoMapper