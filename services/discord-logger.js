import { Client, Intents } from "discord.js"
import loggingLevel from '../common/logging-level.js'

const delay = (duration) => {
    return new Promise((resolve) => {
        setTimeout(resolve, duration)
    })
}
class DiscordLogger {
    constructor({ discordToken, discordServerId, discordChannelId }) {
        let client = new Client({
            intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
        })

        this.channel = null

        this.attemptLogin(client, discordToken, discordServerId, discordChannelId)
    }

    async attemptLogin(client, token, serverId, channelId) {
        let counter = 0
        while(!this.channel || counter < 10) {
            console.log('Attempting to connect to discord.')

            client.login(token).then(() => {
                client.once('ready', () => {
                    let guild = client.guilds.cache.get(serverId)
                    let channel = guild?.channels.cache.get(channelId)
                    
                    if (channel) {
                        const startMessage = 'Discord logger started!'
                        console.log(startMessage)
                        channel.send(startMessage)
                        this.channel = channel
                    } else {
                        console.log('Discord logger failed to initialize!')
                    }
                })
            })

            await delay(10000)
        }

        if (counter >= 10) {
            console.log('Too many discord connect attempts.')
        }
    }
    
    log(level, message) {
        let now = new Date()
        
        if (!this.channel) {
            console.log('Discord logger has not started.')

            return
        }

        if (level === loggingLevel.important) {
            this.channel.send(`(${now.toISOString()}) [${loggingLevel.important}] @everyone\n${message}`)
        } else {
            this.channel.send(`(${now.toISOString()}) [${level}] ${message}`)
        }
    }
}

export default DiscordLogger