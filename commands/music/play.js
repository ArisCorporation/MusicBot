const { QueryType, useMainPlayer } = require('discord-player')
const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js')
const { Translate } = require('../../process_tools')

module.exports = {
  name: 'play',
  description: 'Spiele ein Lied!',
  voiceChannel: true,
  options: [
    {
      name: 'song',
      description: 'Das Lied, das du spielen möchtest',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  async execute({ inter, client }) {
    const player = useMainPlayer()

    const song = inter.options.getString('song')
    const res = await player.search(song, {
      requestedBy: inter.member,
      searchEngine: QueryType.AUTO,
    })

    let defaultEmbed = new EmbedBuilder().setColor('#00ffe8')

    if (!res?.tracks.length) {
      defaultEmbed.setAuthor({
        name: await Translate(
          `Keine Ergebnisse gefunden... nochmal versuchen? <❌>`
        ),
      })
      return inter.editReply({ embeds: [defaultEmbed] })
    }

    try {
      const { track } = await player.play(inter.member.voice.channel, song, {
        nodeOptions: {
          metadata: {
            channel: inter.channel,
          },
          volume: client.config.opt.volume,
          leaveOnEmpty: client.config.opt.leaveOnEmpty,
          leaveOnEmptyCooldown: client.config.opt.leaveOnEmptyCooldown,
          leaveOnEnd: client.config.opt.leaveOnEnd,
          leaveOnEndCooldown: client.config.opt.leaveOnEndCooldown,
        },
      })

      defaultEmbed.setAuthor({
        name: await Translate(
          `Lade <${track.title}> in die Warteschlange... <✅>`
        ),
      })
      await inter.editReply({ embeds: [defaultEmbed] })
    } catch (error) {
      console.log(`Play error: ${error}`)
      defaultEmbed.setAuthor({
        name: await Translate(
          `Ich kann dem Sprachkanal nicht beitreten... nochmal versuchen? <❌>`
        ),
      })
      return inter.editReply({ embeds: [defaultEmbed] })
    }
  },
}
