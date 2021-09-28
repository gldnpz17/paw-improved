import loggingLevel from '../common/logging-level.js'
class ConsoleLogger {
    log(level, message) {
        let now = new Date()
        
        let logMessage = `(${now.toISOString()}) [${level}] ${message}`

        if (level === loggingLevel.important) {
            console.warn(`[ERROR!]\n${logMessage}`)
        } else {
            console.log(logMessage)
        }
    }
}

export default ConsoleLogger