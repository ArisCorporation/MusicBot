const { EmbedBuilder } = require('discord.js')
const { Translate } = require('../../process_tools')

module.exports = (queue) => {
  if (queue.metadata.lyricsThread) {
    queue.metadata.lyricsThread.delete()
    queue.setMetadata({
      channel: queue.metadata.channel,
    })
  }

  ;(async () => {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: await Translate(
          `Niemand ist im Sprachkanal, verlasse den Sprachkanal!  <❌>`
        ),
      })
      .setColor('#00ffe8')

    queue.metadata.channel.send({ embeds: [embed] })
  })()
}
