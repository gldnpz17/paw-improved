import loggingLevel from '../common/logging-level.js'

const GenericErrorHandler = (loggingService) => (err, req, res, next) => {
    loggingService.log(loggingLevel.important, 
        '**An unhandled error has occured!**\n'+
        '**message:** ' + err.message + '\n' +
        '**stack:** ' + err.stack)

    res.sendStatus(500)
}

export default GenericErrorHandler