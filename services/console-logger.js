class ConsoleLogger {
  log(loggingLevel, message) {
    let now = new Date()

    console.log(`(${now.toISOString()}) [${loggingLevel}] ${message}`)
  }
}

export default ConsoleLogger