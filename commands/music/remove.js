const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js')
const { useMainPlayer, useQueue } = require('discord-player')
const { Translate } = require('../../process_tools')

module.exports = {
  name: 'remove',
  description: 'Entferne einen Song aus der Warteschlange',
  voiceChannel: true,
  options: [
    {
      name: 'song',
      description: 'Der Name/URL des Tracks, den du entfernen möchtest',
      type: ApplicationCommandOptionType.String,
      required: false,
    },
    {
      name: 'number',
      description: 'Die Position des Songs in der Warteschlange',
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

    const number = inter.options.getNumber('number')
    const track = inter.options.getString('song')
    if (!track && !number)
      inter.editReply({
        content: await Translate(
          `Du musst eine der Optionen verwenden, um einen Song zu entfernen <${inter.member}>... nochmal versuchen? <❌>`
        ),
      })

    let trackName

    if (track) {
      const toRemove = queue.tracks
        .toArray()
        .find((t) => t.title === track || t.url === track)
      if (!toRemove)
        return inter.editReply({
          content: await Translate(
            `Konnte <${track}> nicht finden <${inter.member}>... versuche die URL oder den vollständigen Namen des Songs zu verwenden? <❌>`
          ),
        })

      queue.removeTrack(toRemove)
    } else if (number) {
      const index = number - 1
      const name = queue.tracks.toArray()[index].title
      if (!name)
        return inter.editReply({
          content: await Translate(
            `Dieser Track scheint nicht zu existieren <${inter.member}>... nochmal versuchen? <❌>`
          ),
        })

      queue.removeTrack(index)

      trackName = name
    }

    const embed = new EmbedBuilder().setColor('#00ffe8').setAuthor({
      name: await Translate(
        `Entfernt <${trackName}> aus der Warteschlange <✅>`
      ),
    })

    return inter.editReply({ embeds: [embed] })
  },
}
