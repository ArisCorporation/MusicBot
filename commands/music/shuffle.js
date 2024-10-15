const { EmbedBuilder } = require('discord.js')
const { useQueue } = require('discord-player')
const { Translate } = require('../../process_tools')

module.exports = {
  name: 'shuffle',
  description: 'Die Warteschlange mischen',
  voiceChannel: true,

  async execute({ inter }) {
    const queue = useQueue(inter.guild)
    if (!queue?.isPlaying())
      return inter.editReply({
        content: await Translate(
          `Zurzeit wird keine Musik abgespielt <${inter.member}>... nochmal versuchen? <❌>`
        ),
      })

    if (!queue.tracks.toArray()[0])
      return inter.editReply({
        content: await Translate(
          `Keine Musik in der Warteschlange nach dem aktuellen Titel <${inter.member}>... nochmal versuchen? <❌>`
        ),
      })

    queue.tracks.shuffle()

    const embed = new EmbedBuilder().setColor('#00ffe8').setAuthor({
      name: await Translate(
        `Warteschlange gemischt <${queue.tracks.size}> Lied(er)! <✅>`
      ),
    })

    return inter.editReply({ embeds: [embed] })
  },
}
