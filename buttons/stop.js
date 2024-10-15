const { EmbedBuilder } = require('discord.js')
const { Translate } = require('../process_tools')

module.exports = async ({ inter, queue }) => {
  if (!queue?.isPlaying())
    return inter.editReply({
      content: await Translate(
        `Zurzeit wird keine Musik abgespielt... nochmal versuchen? <❌>`
      ),
    })

  queue.delete()

  const embed = new EmbedBuilder().setColor('#00ffe8').setAuthor({
    name: await Translate(
      `Musik in diesem Server gestoppt, bis zum nächsten Mal <✅>`
    ),
  })

  return inter.editReply({ embeds: [embed] })
}
