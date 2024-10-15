const { EmbedBuilder } = require('discord.js')
const { useQueue } = require('discord-player')
const { Translate } = require('../../process_tools')

module.exports = {
  name: 'stop',
  description: 'Stoppe den Track',
  voiceChannel: true,

  async execute({ inter }) {
    const queue = useQueue(inter.guild)
    if (!queue?.isPlaying())
      return inter.editReply({
        content: await Translate(
          `Zurzeit wird keine Musik abgespielt <${inter.member}>... versuche es erneut? <❌>`
        ),
      })

    queue.delete()

    const embed = new EmbedBuilder().setColor('#00ffe8').setAuthor({
      name: await Translate(
        `Musik in diesem Server gestoppt, bis zum nächsten Mal <✅>`
      ),
    })

    return inter.editReply({ embeds: [embed] })
  },
}
