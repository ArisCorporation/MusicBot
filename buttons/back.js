const { Translate } = require('../process_tools')

module.exports = async ({ inter, queue }) => {
  if (!queue?.isPlaying())
    return inter.editReply({
      content: await Translate(
        `Zurzeit wird keine Musik abgespielt... nochmal versuchen? <❌>`
      ),
    })
  if (!queue.history.previousTrack)
    return inter.editReply({
      content: await Translate(
        `Es wurde vorher keine Musik abgespielt <${inter.member}>... nochmal versuchen? <❌>`
      ),
    })

  await queue.history.back()

  inter.editReply({
    content: await Translate(`Spiele den <**vorherigen**> Titel <✅>`),
  })
}
