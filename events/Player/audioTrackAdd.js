const { EmbedBuilder } = require('discord.js')
const { Translate } = require('../../process_tools')

module.exports = (queue, track) => {
  if (!client.config.app.extraMessages) return
  ;(async () => {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: await Translate(
          `Titel <${track.title}> zur Warteschlange hinzugefügt <✅>`
        ),
        iconURL: track.thumbnail,
      })
      .setColor('#00ffe8')

    queue.metadata.channel.send({ embeds: [embed] })
  })()
}
