const { QueueRepeatMode } = require('discord-player')
const { Translate } = require('../process_tools')

module.exports = async ({ inter, queue }) => {
  const methods = ['deaktiviert', 'Titel', 'Warteschlange']
  if (!queue?.isPlaying())
    return inter.editReply({
      content: await Translate(
        `Zurzeit wird keine Musik abgespielt... nochmal versuchen? <❌>`
      ),
    })

  if (queue.repeatMode === 2) queue.setRepeatMode(QueueRepeatMode.OFF)
  else queue.setRepeatMode(queue.repeatMode + 1)

  return inter.editReply({
    content: await Translate(
      `Wiederholungsmodus wurde auf <**${
        methods[queue.repeatMode]
      }**> gesetzt.<✅>`
    ),
  })
}
