import { Client, Intents } from "discord.js"
import loggingLevel from '../common/logging-level.js'

class DiscordLogger {
    constructor({ discordToken, discordServerId, discordChannelId }) {
        let client = new Client({
            intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
        })
        this.channel = null
        client.login(discordToken).then(() => {
            client.once('ready', () => {
                let guild = client.guilds.cache.get(discordServerId)
                let channel = guild?.channels.cache.get(discordChannelId)
                
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