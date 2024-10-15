const { Translate } = require('../process_tools')

const maxVol = client.config.opt.maxVol

module.exports = async ({ inter, queue }) => {
  if (!queue?.isPlaying())
    return inter.editReply({
      content: await Translate(
        `Zurzeit wird keine Musik abgespielt... nochmal versuchen? <❌>`
      ),
    })

  const vol = Math.floor(queue.node.volume - 5)
  if (vol < 0)
    return inter.editReply({
      content: await Translate(
        `Ich kann die Lautstärke nicht weiter verringern <${inter.member}>... nochmal versuchen? <❌>`
      ),
    })
  if (queue.node.volume === vol)
    return inter.editReply({
      content: await Translate(
        `Die gewünschte Lautstärke ist bereits eingestellt <${inter.member}>... nochmal versuchen? <❌>`
      ),
    })

  const success = queue.node.setVolume(vol)
  return inter.editReply({
    content: success
      ? await Translate(
          `Die Lautstärke wurde auf <${vol}/${maxVol}% 🔊> geändert`
        )
      : await Translate(
          `Etwas ist schief gelaufen <${inter.member}>... nochmal versuchen? <❌>`
        ),
  })
}
