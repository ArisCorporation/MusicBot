const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js')
const { QueryType, useMainPlayer } = require('discord-player')
const { Translate } = require('../../process_tools')

module.exports = {
  name: 'search',
  description: 'Suche ein Lied',
  voiceChannel: true,
  options: [
    {
      name: 'song',
      description: 'Das Lied, das du suchen möchtest',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  async execute({ client, inter }) {
    const player = useMainPlayer()
    const song = inter.options.getString('song')

    const res = await player.search(song, {
      requestedBy: inter.member,
      searchEngine: QueryType.AUTO,
    })

    if (!res?.tracks.length)
      return inter.editReply({
        content: await Translate(
          `Keine Ergebnisse gefunden <${inter.member}>... nochmal versuchen? <❌>`
        ),
      })

    const queue = player.nodes.create(inter.guild, {
      metadata: {
        channel: inter.channel,
      },
      spotifyBridge: client.config.opt.spotifyBridge,
      volume: client.config.opt.defaultvolume,
      leaveOnEnd: client.config.opt.leaveOnEnd,
      leaveOnEmpty: client.config.opt.leaveOnEmpty,
    })
    const maxTracks = res.tracks.slice(0, 10)

    const embed = new EmbedBuilder()
      .setColor('#00ffe8')
      .setAuthor({
        name: await Translate(`Ergebnisse für <${song}>`),
        iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }),
      })
      .setDescription(
        await Translate(
          `<${maxTracks
            .map((track, i) => `**${i + 1}**. ${track.title} | ${track.author}`)
            .join('\n')}\n\n> Wähle eine Option zwischen <**1**> und <**${
            maxTracks.length
          }**> oder <**abbrechen** ⬇️>`
        )
      )
      .setTimestamp()
      .setFooter({
        text: await Translate(
          'Musik kommt zuerst - Mit Herz gemacht von der Community <❤️>'
        ),
        iconURL: inter.member.avatarURL({ dynamic: true }),
      })

    inter.editReply({ embeds: [embed] })

    const collector = inter.channel.createMessageCollector({
      time: 15000,
      max: 1,
      errors: ['time'],
      filter: (m) => m.author.id === inter.member.id,
    })

    collector.on('collect', async (query) => {
      collector.stop()
      if (query.content.toLowerCase() === 'abbrechen') {
        return inter.followUp({
          content: await Translate(`Suche abgebrochen <✅>`),
          ephemeral: true,
        })
      }

      const value = parseInt(query)
      if (!value || value <= 0 || value > maxTracks.length) {
        return inter.followUp({
          content: await Translate(
            `Ungültige Antwort, versuche einen Wert zwischen <**1**> und <**${maxTracks.length}**> oder <**abbrechen**>... nochmal versuchen? <❌>`
          ),
          ephemeral: true,
        })
      }

      try {
        if (!queue.connection) await queue.connect(inter.member.voice.channel)
      } catch {
        await player.deleteQueue(inter.guildId)
        return inter.followUp({
          content: await Translate(
            `Ich kann dem Sprachkanal nicht beitreten <${inter.member}>... nochmal versuchen? <❌>`
          ),
          ephemeral: true,
        })
      }

      await inter.followUp({
        content: await Translate(`Lade deine Suche... <🎧>`),
        ephemeral: true,
      })

      queue.addTrack(res.tracks[query.content - 1])

      if (!queue.isPlaying()) await queue.node.play()
    })

    collector.on('end', async (msg, reason) => {
      if (reason === 'time')
        return inter.followUp({
          content: await Translate(
            `Suche abgelaufen <${inter.member}>... nochmal versuchen? <❌>`
          ),
          ephemeral: true,
        })
    })
  },
}
