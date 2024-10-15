const ms = require('ms')
const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js')
const { useQueue } = require('discord-player')
const { Translate } = require('../../process_tools')

module.exports = {
  name: 'seek',
  description: 'Gehe vor oder zurück in einem Lied',
  voiceChannel: true,
  options: [
    {
      name: 'time',
      description: 'Die Zeit, zu der gesprungen werden soll',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  async execute({ inter }) {
    const queue = useQueue(inter.guild)
    if (!queue?.isPlaying())
      return inter.editReply({
        content: await Translate(
          `Derzeit wird keine Musik abgespielt <${inter.editReply}>... nochmal versuchen? <❌>`
        ),
      })

    const timeToMS = ms(inter.options.getString('time'))
    if (timeToMS >= queue.currentTrack.durationMS) {
      return inter.editReply({
        content: await Translate(
          `Die angegebene Zeit ist länger als die Gesamtdauer des aktuellen Liedes <${inter.member}>... nochmal versuchen? <❌\n> *Versuche zum Beispiel eine gültige Zeit wie <**5s, 10s, 20 Sekunden, 1m**>...*`
        ),
      })
    }

    await queue.node.seek(timeToMS)

    const embed = new EmbedBuilder().setColor('#00ffe8').setAuthor({
      name: await Translate(
        `Zeit im aktuellen Lied auf <**${ms(timeToMS, {
          long: true,
        })}**> gesetzt <✅>`
      ),
    })

    inter.editReply({ embeds: [embed] })
  },
}
