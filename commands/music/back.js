const { EmbedBuilder } = require('discord.js')
const { useQueue } = require('discord-player')
const { Translate } = require('../../process_tools')

module.exports = {
  name: 'back',
  description: 'Gehe zurück zum letzten gespielten Lied',
  voiceChannel: true,

  async execute({ inter }) {
    const queue = useQueue(inter.guild)
    if (!queue?.isPlaying())
      return inter.editReply({
        content: await Translate(
          `Zurzeit wird keine Musik abgespielt <${inter.member}>... nochmal versuchen? <❌>`
        ),
      })

    if (!queue.history.previousTrack)
      return inter.editReply({
        content: await Translate(
          `Es wurde vorher keine Musik abgespielt <${inter.member}>... nochmal versuchen? <❌>`
        ),
      })

    await queue.history.back()

    const backEmbed = new EmbedBuilder()
      .setAuthor({
        name: await Translate(`Das vorherige Lied wird abgespielt <✅>`),
      })
      .setColor('#00ffe8')

    inter.editReply({ embeds: [backEmbed] })
  },
}
