const { EmbedBuilder } = require('discord.js')
const { useQueue } = require('discord-player')
const { Translate } = require('../../process_tools')

module.exports = {
  name: 'pause',
  description: 'Pausiere den Track',
  voiceChannel: true,

  async execute({ inter }) {
    const queue = useQueue(inter.guild)
    if (!queue?.isPlaying())
      return inter.editReply({
        content: await Translate(
          `Zurzeit wird keine Musik abgespielt <${inter.member}>... nochmal versuchen? <❌>`
        ),
      })

    if (queue.node.isPaused())
      return inter.editReply({
        content: await Translate(
          `Der Track ist bereits pausiert, <${inter.member}>... nochmal versuchen? <❌>`
        ),
      })

    const success = queue.node.setPaused(true)
    const pauseEmbed = new EmbedBuilder()
      .setAuthor({
        name: success
          ? await Translate(
              `Aktuelle Musik <${queue.currentTrack.title}> pausiert <✅>`
            )
          : await Translate(
              `Etwas ist schief gelaufen <${inter.member}>... nochmal versuchen? <❌>`
            ),
      })
      .setColor('#00ffe8')

    return inter.editReply({ embeds: [pauseEmbed] })
  },
}
