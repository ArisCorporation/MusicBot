const { EmbedBuilder } = require('discord.js')
const { Translate } = require('../../process_tools')
module.exports = (queue, error) => {
  ;(async () => {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: await Translate(
          `Der Bot hatte einen unerwarteten Fehler, bitte überprüfen Sie sofort die Konsole!`
        ),
      })
      .setColor('#EE4B2B')

    queue.metadata.channel.send({ embeds: [embed] })

    console.log(`Fehler vom Player ausgegeben <${error.message}>`)
  })()
}
