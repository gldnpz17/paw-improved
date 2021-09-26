const AssignmentDtoMapper = {
    map: (assignment) => {
        let { _id, ...assignmentFields } = assignment
        
        return {
            id: _id,
            ...assignmentFields
        }
    }
}

export default AssignmentDtoMapper