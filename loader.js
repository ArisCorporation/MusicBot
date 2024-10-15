const { readdirSync } = require('fs')
const fs = require('fs')
const path = require('path')
const { Collection } = require('discord.js')
const { useMainPlayer } = require('discord-player')
client.commands = new Collection()
const commandsArray = []
const player = useMainPlayer()
const { Translate, GetTranslationModule } = require('./process_tools')

const discordEvents = readdirSync('./events/Discord/').filter((file) =>
  file.endsWith('.js')
)
const playerEvents = readdirSync('./events/Player/').filter((file) =>
  file.endsWith('.js')
)

GetTranslationModule().then(() => {
  console.log('| Übersetzungsmodul geladen |')

  for (const file of discordEvents) {
    const DiscordEvent = require(`./events/Discord/${file}`)
    const txtEvent = `< -> > [Geladenes Discord-Ereignis] <${
      file.split('.')[0]
    }>`
    parseLog(txtEvent)
    client.on(file.split('.')[0], DiscordEvent.bind(null, client))
    delete require.cache[require.resolve(`./events/Discord/${file}`)]
  }

  for (const file of playerEvents) {
    const PlayerEvent = require(`./events/Player/${file}`)
    const txtEvent = `< -> > [Geladenes Player-Ereignis] <${
      file.split('.')[0]
    }>`
    parseLog(txtEvent)
    player.events.on(file.split('.')[0], PlayerEvent.bind(null))
    delete require.cache[require.resolve(`./events/Player/${file}`)]
  }

  fs.readdirSync('./commands/').forEach((dirs) => {
    const fullPath = path.join('./commands', dirs)
    if (fs.statSync(fullPath).isDirectory()) {
      const commands = fs
        .readdirSync(fullPath)
        .filter((files) => files.endsWith('.js'))

      for (const file of commands) {
        const command = require(`./commands/${dirs}/${file}`)
        if (command.name && command.description) {
          commandsArray.push(command)
          const txtEvent = `< -> > [Geladenes Kommando] <${command.name.toLowerCase()}>`
          parseLog(txtEvent)
          client.commands.set(command.name.toLowerCase(), command)
          delete require.cache[require.resolve(`./commands/${dirs}/${file}`)]
        } else {
          const txtEvent = `< -> > [Fehlgeschlagenes Kommando] <${command.name.toLowerCase()}>`
          parseLog(txtEvent)
        }
      }
    } else {
      console.log(`Skipping non-directory file: ${fullPath}`)
    }
  })

  client.on('ready', (client) => {
    if (client.config.app.global) client.application.commands.set(commandsArray)
    else
      client.guilds.cache
        .get(client.config.app.guild)
        .commands.set(commandsArray)
  })

  async function parseLog(txtEvent) {
    console.log(await Translate(txtEvent, null))
  }
})
