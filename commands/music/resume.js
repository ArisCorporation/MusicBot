const { EmbedBuilder } = require('discord.js')
const { useQueue } = require('discord-player')
const { Translate } = require('../../process_tools')

module.exports = {
  name: 'resume',
  description: 'Spiele den Track',
  voiceChannel: true,

  async execute({ inter }) {
    const queue = useQueue(inter.guild)
    if (!queue)
      return inter.editReply({
        content: await Translate(
          `Zurzeit wird keine Musik abgespielt <${inter.member}>... nochmal versuchen? <❌>`
        ),
      })

    if (queue.node.isPlaying())
      return inter.editReply({
        content: await Translate(
          `Der Track läuft bereits, <${inter.member}>... nochmal versuchen? <❌>`
        ),
      })

    const success = queue.node.resume()

    const resumeEmbed = new EmbedBuilder()
      .setAuthor({
        name: success
          ? await Translate(
              `Aktuelle Musik <${queue.currentTrack.title}> fortgesetzt <✅>`
            )
          : await Translate(
              `Etwas ist schief gelaufen <${inter.member}>... nochmal versuchen? <❌>`
            ),
      })
      .setColor('#00ffe8')

    return inter.editReply({ embeds: [resumeEmbed] })
  },
}
