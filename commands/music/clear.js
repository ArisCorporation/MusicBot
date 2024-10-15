const { EmbedBuilder } = require('discord.js')
const { useQueue } = require('discord-player')
const { Translate } = require('../../process_tools')

module.exports = {
  name: 'clear',
  description: 'Lösche alle Musik in der Warteschlange',
  voiceChannel: true,

  async execute({ inter }) {
    const queue = useQueue(inter.guild)
    if (!queue?.isPlaying())
      return inter.editReply({
        content: await Translate(
          `Zurzeit wird keine Musik abgespielt <${inter.member}>... nochmal versuchen? <❌>`
        ),
      })

    if (!queue.tracks.toArray()[1])
      return inter.editReply({
        content: await Translate(
          `Keine Musik in der Warteschlange nach dem aktuellen Titel <${inter.member}>... nochmal versuchen? <❌>`
        ),
      })

    queue.tracks.clear()

    const clearEmbed = new EmbedBuilder()
      .setAuthor({
        name: await Translate(`Die Warteschlange wurde gerade geleert <🗑️>`),
      })
      .setColor('#00ffe8')

    inter.editReply({ embeds: [clearEmbed] })
  },
}
