const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js')
const { useQueue } = require('discord-player')
const { Translate } = require('../../process_tools')

module.exports = {
  name: 'jump',
  description: 'Springt zu einem bestimmten Titel in der Warteschlange',
  voiceChannel: true,
  options: [
    {
      name: 'song',
      description: 'Der Name/URL des Titels, zu dem Sie springen möchten',
      type: ApplicationCommandOptionType.String,
      required: false,
    },
    {
      name: 'number',
      description:
        'Der Platz in der Warteschlange, an dem sich der Song befindet',
      type: ApplicationCommandOptionType.Number,
      required: false,
    },
  ],

  async execute({ inter }) {
    const queue = useQueue(inter.guild)
    if (!queue?.isPlaying())
      return inter.editReply({
        content: await Translate(
          `Zurzeit wird keine Musik abgespielt <${inter.member}>... nochmal versuchen? <❌>`
        ),
      })

    const track = inter.options.getString('song')
    const number = inter.options.getNumber('number')
    if (!track && !number)
      inter.editReply({
        content: await Translate(
          `Sie müssen eine der Optionen verwenden, um zu einem Song zu springen <${inter.member}>... nochmal versuchen? <❌>`
        ),
      })

    let trackName
    if (track) {
      const toJump = queue.tracks
        .toArray()
        .find(
          (t) =>
            t.title.toLowerCase() === track.toLowerCase() || t.url === track
        )
      if (!toJump)
        return inter.editReply({
          content: await Translate(
            `Konnte <${track}> nicht finden <${inter.member}>... versuchen Sie es mit der URL oder dem vollständigen Namen des Songs? <❌>`
          ),
        })

      queue.node.jump(toJump)
      trackName = toJump.title
    } else if (number) {
      const index = number - 1
      const name = queue.tracks.toArray()[index].title
      if (!name)
        return inter.editReply({
          content: await Translate(
            `Dieser Titel scheint nicht zu existieren <${inter.member}>... nochmal versuchen? <❌>`
          ),
        })

      queue.node.jump(index)
      trackName = name
    }

    const jumpEmbed = new EmbedBuilder()
      .setAuthor({ name: await Translate(`Zu <${trackName}> gesprungen <✅>`) })
      .setColor('#00ffe8')

    inter.editReply({ embeds: [jumpEmbed] })
  },
}
