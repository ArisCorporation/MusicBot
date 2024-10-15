const { EmbedBuilder } = require('discord.js')
const { Translate } = require('../../process_tools')

module.exports = (queue) => {
  if (!client.config.app.extraMessages) return
  ;(async () => {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: await Translate(
          `Alle Lieder in der Playlist wurden zur Warteschlange hinzugefügt <✅>`
        ),
      })
      .setColor('#00ffe8')

    queue.metadata.channel.send({ embeds: [embed] })
  })()
}
