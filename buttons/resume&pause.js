const { Translate } = require('../process_tools')

module.exports = async ({ inter, queue }) => {
  if (!queue?.isPlaying())
    return inter.editReply({
      content: await Translate(
        `Zurzeit wird keine Musik abgespielt... nochmal versuchen? <❌>`
      ),
    })

  const resumed = queue.node.resume()
  let message = await Translate(
    `Aktuelle Musik <${queue.currentTrack.title}> fortgesetzt <✅>`
  )

  if (!resumed) {
    queue.node.pause()
    message = await Translate(
      `Aktuelle Musik <${queue.currentTrack.title}> pausiert <✅>`
    )
  }

  return inter.editReply({ content: message })
}
