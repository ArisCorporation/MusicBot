const { Translate } = require('../process_tools')

module.exports = async ({ inter, queue }) => {
  if (!queue?.isPlaying())
    return inter.editReply({
      content: await Translate(
        `Zurzeit wird keine Musik abgespielt... nochmal versuchen? <❌>`
      ),
    })

  const success = queue.node.skip()

  return inter.editReply({
    content: success
      ? await Translate(
          `Aktuelle Musik <${queue.currentTrack.title}> übersprungen <✅>`
        )
      : await Translate(
          `Etwas ist schief gelaufen <${inter.member}>... nochmal versuchen? <❌>`
        ),
  })
}
