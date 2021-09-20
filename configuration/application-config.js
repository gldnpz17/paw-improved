import dotenv from 'dotenv'

dotenv.config()

let applicationConfig = {
  mongodbConnection: process.env.MONGODB_CONNECTION,
  port: process.env.PORT || 3000
}

export default applicationConfig