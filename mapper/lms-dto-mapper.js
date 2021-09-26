const LmsDtoMapper = {
    map: (lms) => {
        let { _id, ...lmsFields } = lms
        
        return {
            id: _id,
            ...lmsFields
        }
    }
}

export default LmsDtoMapper