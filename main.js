require('dotenv').config()

const { Player } = require('discord-player')
const { Client, GatewayIntentBits } = require('discord.js')

global.client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
  disableMentions: 'everyone',
})

client.config = require('./config')

const player = new Player(client, client.config.opt.discordPlayer)
player.extractors.loadDefault()

console.clear()
require('./loader')

client.login(client.config.app.token).catch(async (e) => {
  if (e.message === 'An invalid token was provided.') {
    require('./process_tools').throwConfigError(
      'app',
      'token',
      '\n\t   ❌ Ungültiges Token bereitgestellt! ❌ \n\tÄndern Sie das Token in der Konfigurationsdatei\n'
    )
  } else {
    console.error(
      '❌ Ein Fehler ist beim Versuch, den Bot anzumelden, aufgetreten! ❌ \n',
      e
    )
  }
})
