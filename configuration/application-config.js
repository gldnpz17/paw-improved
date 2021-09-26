import dotenv from 'dotenv'

dotenv.config()

let applicationConfig = {
  mongodbConnection: process.env.MONGODB_CONNECTION,
  port: process.env.PORT || 3000,
  redisConnection: process.env.REDIS_CONNECTION
}

export default applicationConfig