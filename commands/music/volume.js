const maxVol = client.config.opt.maxVol || 100
const { ApplicationCommandOptionType } = require('discord.js')
const { useQueue } = require('discord-player')
const { Translate } = require('../../process_tools')

module.exports = {
  name: 'volume',
  description: 'Lautstärke anpassen',
  voiceChannel: true,
  options: [
    {
      name: 'volume',
      description: 'Die neue Lautstärke',
      type: ApplicationCommandOptionType.Number,
      required: true,
      minValue: 1,
      maxValue: maxVol,
    },
  ],

  async execute({ inter }) {
    const queue = useQueue(inter.guild)
    if (!queue?.isPlaying())
      return inter.editReply({
        content: await Translate(
          `Zurzeit wird keine Musik abgespielt <${inter.member}>... nochmal versuchen? <❌>`
        ),
      })

    const vol = inter.options.getNumber('volume')
    if (queue.node.volume === vol)
      return inter.editReply({
        content: await Translate(
          `Die neue Lautstärke ist bereits die aktuelle <${inter.member}>... nochmal versuchen? <❌>`
        ),
      })

    const success = queue.node.setVolume(vol)

    return inter.editReply({
      content: success
        ? await Translate(
            `Die Lautstärke wurde auf <${vol}/${maxVol}%> geändert <🔊>`
          )
        : `Etwas ist schief gelaufen ${inter.member}... nochmal versuchen? ❌`,
    })
  },
}
