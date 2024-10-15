const ms = require('ms')
const { Translate } = require('../../process_tools')

module.exports = {
  name: 'ping',
  description: 'Erhalte den Ping des Bots!',

  async execute({ client, inter }) {
    await inter.editReply('Ping?')
    inter.editReply(
      await Translate(
        `Pong! API-Latenz beträgt <${Math.round(
          client.ws.ping
        )}ms 🛰️>, letzter Herzschlag berechnet vor <${ms(
          Date.now() - client.ws.shards.first().lastPingTimestamp,
          { long: true }
        )}>`
      )
    )
  },
}
