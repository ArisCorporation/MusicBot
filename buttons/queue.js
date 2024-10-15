const { EmbedBuilder } = require('discord.js')
const { Translate } = require('../process_tools')

module.exports = async ({ client, inter, queue }) => {
  if (!queue?.isPlaying())
    return inter.editReply({
      content: await Translate(
        `Zurzeit wird keine Musik abgespielt... nochmal versuchen? <❌>`
      ),
    })
  if (!queue.tracks.toArray()[0])
    return inter.editReply({
      content: await Translate(
        `Keine Musik in der Warteschlange nach dem aktuellen Titel <${inter.member}>... nochmal versuchen? <❌>`
      ),
    })

  const methods = ['', '🔁', '🔂']
  const songs = queue.tracks.length
  const nextSongs =
    songs > 5
      ? await Translate(`Und <**${songs - 5}**> weitere(r) Song(s)...`)
      : await Translate(`In der Playlist <**${songs}**> Song(s)...`)
  const tracks = queue.tracks.map(
    async (track, i) =>
      await Translate(
        `<**${i + 1}**> - <${track.title} | ${
          track.author
        }> (angefordert von: <${
          track.requestedBy ? track.requestedBy.displayName : 'unbekannt'
        }>)`
      )
  )

  const embed = new EmbedBuilder()
    .setColor('#ff0000')
    .setThumbnail(inter.guild.iconURL({ size: 2048, dynamic: true }))
    .setAuthor({
      name: await Translate(
        `Server-Warteschlange - <${inter.guild.name} ${
          methods[queue.repeatMode]
        }>`
      ),
      iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }),
    })
    .setDescription(
      `Aktuell ${queue.currentTrack.title}\n\n${tracks
        .slice(0, 5)
        .join('\n')}\n\n${nextSongs}`
    )
    .setTimestamp()
    .setFooter({
      text: await Translate(
        'Musik kommt zuerst - Mit Herz gemacht von der Community <❤️>'
      ),
      iconURL: inter.member.avatarURL({ dynamic: true }),
    })

  inter.editReply({ embeds: [embed] })
}
