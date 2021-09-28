const routeHandlerErrorWrapper = (handler) => async (req, res, next) => {
    try {
        await handler(req, res)
    } catch (err) {
        next(err)
    }
}

export default routeHandlerErrorWrapper