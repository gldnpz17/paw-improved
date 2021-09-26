import { Client, Intents } from "discord.js"

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

  log(loggingLevel, message) {
    let now = new Date()

    this.channel.send(`(${now.toISOString()}) [${loggingLevel}] ${message}`)
  }
}

export default DiscordLogger