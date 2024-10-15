const { EmbedBuilder } = require('discord.js')
const { Translate } = require('../../process_tools')

module.exports = (queue) => {
  ;(async () => {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: await Translate(
          'Keine weiteren Lieder in der Warteschlange!  <❌>'
        ),
      })
      .setColor('#00ffe8')

    queue.metadata.channel.send({ embeds: [embed] })
  })()
}
