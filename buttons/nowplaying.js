const { EmbedBuilder } = require('discord.js')
const { Translate } = require('../process_tools')

module.exports = async ({ client, inter, queue }) => {
  if (!queue?.isPlaying())
    return inter.editReply({
      content: await Translate(
        `Zurzeit wird keine Musik abgespielt... nochmal versuchen? <❌>`
      ),
    })

  const track = queue.currentTrack
  const methods = ['deaktiviert', 'Titel', 'Warteschlange']
  const timestamp = track.duration
  const trackDuration =
    timestamp.progress == 'Infinity' ? 'unendlich (live)' : track.duration
  const progress = queue.node.createProgressBar()

  const embed = new EmbedBuilder()
    .setAuthor({
      name: track.title,
      iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }),
    })
    .setThumbnail(track.thumbnail)
    .setDescription(
      await Translate(
        `Lautstärke <**${
          queue.node.volume
        }**%\n> <Dauer **${trackDuration}**\n> <Fortschritt ${progress}\n> <Schleifenmodus **${
          methods[queue.repeatMode]
        }**\n> <Angefordert von ${track.requestedBy}>`
      )
    )
    .setFooter({
      text: 'Musik kommt zuerst - Mit Herz gemacht von Zerio ❤️',
      iconURL: inter.member.avatarURL({ dynamic: true }),
    })
    .setColor('ff0000')
    .setTimestamp()

  inter.editReply({ embeds: [embed] })
}
