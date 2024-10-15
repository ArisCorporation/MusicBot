const { EmbedBuilder } = require('discord.js')
const { useQueue } = require('discord-player')
const { Translate } = require('../../process_tools')

module.exports = {
  name: 'queue',
  description: 'Erhalte die Songs in der Warteschlange',
  voiceChannel: true,

  async execute({ client, inter }) {
    const queue = useQueue(inter.guild)

    if (!queue)
      return inter.editReply({
        content: await Translate(
          `Zurzeit wird keine Musik abgespielt <${inter.member}>... nochmal versuchen? <❌>`
        ),
      })
    if (!queue.tracks.toArray()[0])
      return inter.editReply({
        content: await Translate(
          `Keine Musik in der Warteschlange nach dem aktuellen Song <${inter.member}>... nochmal versuchen? <❌>`
        ),
      })

    const methods = ['', '🔁', '🔂']
    const songs = queue.tracks.size
    const nextSongs =
      songs > 5
        ? await Translate(`Und <**${songs - 5}**> weitere Song(s)...`)
        : await Translate(`In der Playlist <**${songs}**> Song(s)...`)
    const tracks = queue.tracks.map(
      (track, i) =>
        `**${i + 1}** - ${track.title} | ${track.author} (angefordert von: ${
          track.requestedBy ? track.requestedBy.displayName : 'unbekannt'
        })`
    )
    const embed = new EmbedBuilder()
      .setColor('#00ffe8')
      .setThumbnail(inter.guild.iconURL({ size: 2048, dynamic: true }))
      .setAuthor({
        name: await Translate(
          `Server-Warteschlange - <${inter.guild.name}> <${
            methods[queue.repeatMode]
          }>`
        ),
        iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }),
      })
      .setDescription(
        await Translate(
          `Aktuell <${queue.currentTrack.title}> <\n\n> <${tracks
            .slice(0, 5)
            .join('\n')}> <\n\n> <${nextSongs}>`
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
  },
}
