const { EmbedBuilder } = require('discord.js')
const { Translate } = require('../../process_tools')

module.exports = (queue, track) => {
  ;(async () => {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: await Translate(
          `Überspringe <**${track.title}**> aufgrund eines Problems! <❌>`
        ),
      })
      .setColor('#EE4B2B')

    queue.metadata.channel.send({ embeds: [embed], iconURL: track.thumbnail })
  })()
}
