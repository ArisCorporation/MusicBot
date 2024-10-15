const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js')
const { useQueue } = require('discord-player')
const { Translate } = require('../../process_tools')

module.exports = {
  name: 'skipto',
  description: 'Springt zu einem bestimmten Titel in der Warteschlange',
  voiceChannel: true,
  options: [
    {
      name: 'song',
      description: 'Der Name/URL des Titels, zu dem du springen möchtest',
      type: ApplicationCommandOptionType.String,
      required: false,
    },
    {
      name: 'number',
      description: 'Die Position des Titels in der Warteschlange',
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
      return inter.editReply({
        content: await Translate(
          `Du musst eine der Optionen verwenden, um zu einem Titel zu springen <${inter.member}>... nochmal versuchen? <❌>`
        ),
      })

    let trackName

    if (track) {
      const skipTo = queue.tracks
        .toArray()
        .find(
          (t) =>
            t.title.toLowerCase() === track.toLowerCase() || t.url === track
        )
      if (!skipTo)
        return inter.editReply({
          content: await Translate(
            `Konnte <${track}> nicht finden <${inter.member}>... versuche die URL oder den vollständigen Namen des Titels zu verwenden? <❌>`
          ),
        })

      trackName = skipTo.title

      queue.node.skipTo(skipTo)
    } else if (number) {
      const index = number - 1
      const name = queue.tracks.toArray()[index].title
      if (!name)
        return inter.editReply({
          content: await Translate(
            `Dieser Titel scheint nicht zu existieren <${inter.member}>... nochmal versuchen? <❌>`
          ),
        })

      trackName = name

      queue.node.skipTo(index)
    }

    const embed = new EmbedBuilder()
      .setAuthor({ name: await Translate(`Zu <${trackName}> gesprungen <✅>`) })
      .setColor('#00ffe8')

    inter.editReply({ embeds: [embed] })
  },
}
