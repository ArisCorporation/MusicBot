const { EmbedBuilder } = require('discord.js')
const { useQueue } = require('discord-player')
const { Translate } = require('../../process_tools')

module.exports = {
  name: 'save',
  description: 'Speichere den aktuellen Titel!',
  voiceChannel: true,

  async execute({ inter }) {
    const queue = useQueue(inter.guild)
    if (!queue?.isPlaying())
      return inter.editReply({
        content: await Translate(
          `Zurzeit wird keine Musik abgespielt <${inter.member}>... nochmal versuchen? <❌>`
        ),
      })

    const embed = new EmbedBuilder()
      .setColor('#00ffe8')
      .setTitle(`:arrow_forward: ${queue.currentTrack.title}`)
      .setURL(queue.currentTrack.url)
      .addFields(
        {
          name: await Translate('Dauer <:hourglass:>'),
          value: `\`${queue.currentTrack.duration}\``,
          inline: true,
        },
        {
          name: await Translate('Lied von:'),
          value: `\`${queue.currentTrack.author}\``,
          inline: true,
        },
        {
          name: await Translate('Aufrufe <:eyes:>'),
          value: `\`${Number(queue.currentTrack.views).toLocaleString()}\``,
          inline: true,
        },
        {
          name: await Translate('Lied <URL>:'),
          value: `\`${queue.currentTrack.url}\``,
        }
      )
      .setThumbnail(queue.currentTrack.thumbnail)
      .setFooter({
        text: await Translate(`Vom Server <${inter.member.guild.name}>`),
        iconURL: inter.member.guild.iconURL({ dynamic: false }),
      })

    inter.member
      .send({ embeds: [embed] })
      .then(async () => {
        return inter.editReply({
          content: await Translate(
            `Ich habe dir die Musik in privaten Nachrichten gesendet <✅>`
          ),
        })
      })
      .catch(async () => {
        return inter.editReply({
          content: await Translate(
            `Ich konnte dir keine private Nachricht senden... nochmal versuchen? <❌>`
          ),
        })
      })
  },
}
