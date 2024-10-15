const { EmbedBuilder } = require('discord.js')
const { useQueue } = require('discord-player')
const { Translate } = require('../../process_tools')

module.exports = {
  name: 'skip',
  description: 'Überspringe den Track',
  voiceChannel: true,

  async execute({ inter }) {
    const queue = useQueue(inter.guild)
    if (!queue?.isPlaying())
      return inter.editReply({
        content: await Translate(
          `Zurzeit wird keine Musik abgespielt <${inter.member}>... nochmal versuchen? <❌>`
        ),
      })

    const success = queue.node.skip()

    const embed = new EmbedBuilder().setColor('#00ffe8').setAuthor({
      name: success
        ? await Translate(
            `Aktuelle Musik <${queue.currentTrack.title}> übersprungen <✅>`
          )
        : await Translate(
            `Etwas ist schief gelaufen <${inter.member}>... nochmal versuchen? <❌>`
          ),
    })

    return inter.editReply({ embeds: [embed] })
  },
}
