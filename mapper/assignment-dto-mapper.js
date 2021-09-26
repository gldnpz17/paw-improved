const AssignmentDtoMapper = {
    map: (assignment) => {
      let { _id, ...assignmentFields } = assignment
  
      return {
        id: _id,
        ...lmsFields
      }
    }
  }
  
  export default LmsDtoMapper