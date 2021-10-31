import dotenv from 'dotenv'

dotenv.config()

let applicationConfig = {
    mongodbConnection: process.env.MONGODB_CONNECTION,
    port: process.env.PORT || 3000,
    redisConnection: process.env.REDIS_CONNECTION,
    loggerType: process.env.LOGGER_TYPE || 'Console',
    discordToken: process.env.DISCORD_TOKEN,
    discordServerId: process.env.DISCORD_SERVER_ID,
    discordChannelId: process.env.DISCORD_CHANNEL_ID
}

export default applicationConfig