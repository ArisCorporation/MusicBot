const { EmbedBuilder } = require('discord.js')
const { useQueue } = require('discord-player')
const { Translate } = require('../../process_tools')

module.exports = {
  name: 'history',
  description: 'Siehe den Verlauf der Warteschlange',
  voiceChannel: false,

  async execute({ inter }) {
    const queue = useQueue(inter.guild)

    if (!queue || queue.history.tracks.toArray().length == 0)
      return inter.editReply({
        content: await Translate(`Es wurde noch keine Musik abgespielt`),
      })

    const tracks = queue.history.tracks.toArray()

    let description = tracks
      .slice(0, 20)
      .map((track, index) => {
        return `**${index + 1}.** [${track.title}](${track.url}) von ${
          track.author
        }`
      })
      .join('\r\n\r\n')

    let historyEmbed = new EmbedBuilder()
      .setTitle(`Verlauf`)
      .setDescription(description)
      .setColor('#00ffe8')
      .setTimestamp()
      .setFooter({
        text: await Translate(
          'Musik kommt zuerst - Mit Herz gemacht von der Community <❤️>'
        ),
        iconURL: inter.member.avatarURL({ dynamic: true }),
      })

    inter.editReply({ embeds: [historyEmbed] })
  },
}
