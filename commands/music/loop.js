const { QueueRepeatMode, useQueue } = require('discord-player')
const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js')
const { Translate } = require('../../process_tools')

module.exports = {
  name: 'loop',
  description:
    'Schalte das Wiederholen von Liedern oder der gesamten Warteschlange um',
  voiceChannel: true,
  options: [
    {
      name: 'aktion',
      description: 'Welche Aktion möchten Sie auf die Schleife anwenden?',
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        { name: 'Warteschlange', value: 'enable_loop_queue' },
        { name: 'Deaktivieren', value: 'disable_loop' },
        { name: 'Lied', value: 'enable_loop_song' },
        { name: 'Autoplay', value: 'enable_autoplay' },
      ],
    },
  ],

  async execute({ inter }) {
    const queue = useQueue(inter.guild)
    const errorMessage = await Translate(
      `Etwas ist schief gelaufen <${inter.member}>... nochmal versuchen? <❌>`
    )
    let baseEmbed = new EmbedBuilder().setColor('#00ffe8')

    if (!queue?.isPlaying())
      return inter.editReply({
        content: await Translate(
          `Zurzeit wird keine Musik abgespielt <${inter.member}>... nochmal versuchen? <❌>`
        ),
      })

    switch (inter.options._hoistedOptions.map((x) => x.value).toString()) {
      case 'enable_loop_queue': {
        if (queue.repeatMode === QueueRepeatMode.TRACK)
          return inter.editReply({
            content: `Sie müssen zuerst die aktuelle Musik im Schleifenmodus deaktivieren (\`/loop Deaktivieren\`) ${inter.member}... nochmal versuchen? ❌`,
          })

        const success = queue.setRepeatMode(QueueRepeatMode.QUEUE)
        baseEmbed.setAuthor({
          name: success
            ? errorMessage
            : await Translate(
                `Wiederholungsmodus aktiviert, die gesamte Warteschlange wird endlos wiederholt <🔁>`
              ),
        })

        return inter.editReply({ embeds: [baseEmbed] })
      }
      case 'disable_loop': {
        if (queue.repeatMode === QueueRepeatMode.OFF)
          return inter.editReply({
            content: await Translate(
              `Sie müssen zuerst den Schleifenmodus aktivieren <(/loop Warteschlange oder /loop Lied)> <${inter.member}>... nochmal versuchen? <❌>`
            ),
          })

        const success = queue.setRepeatMode(QueueRepeatMode.OFF)
        baseEmbed.setAuthor({
          name: success
            ? errorMessage
            : await Translate(
                `Wiederholungsmodus deaktiviert, die Warteschlange wird nicht mehr wiederholt <🔁>`
              ),
        })

        return inter.editReply({ embeds: [baseEmbed] })
      }
      case 'enable_loop_song': {
        if (queue.repeatMode === QueueRepeatMode.QUEUE)
          return inter.editReply({
            content: await Translate(
              `Sie müssen zuerst die aktuelle Musik im Schleifenmodus deaktivieren <(\`/loop Deaktivieren\`)> <${inter.member}>... nochmal versuchen? <❌>`
            ),
          })

        const success = queue.setRepeatMode(QueueRepeatMode.TRACK)
        baseEmbed.setAuthor({
          name: success
            ? errorMessage
            : await Translate(
                `Wiederholungsmodus aktiviert, das aktuelle Lied wird endlos wiederholt (Sie können die Schleife mit <\`/loop deaktivieren\` > beenden)`
              ),
        })

        return inter.editReply({ embeds: [baseEmbed] })
      }
      case 'enable_autoplay': {
        if (queue.repeatMode === QueueRepeatMode.AUTOPLAY)
          return inter.editReply({
            content: await Translate(
              `Sie müssen zuerst die aktuelle Musik im Schleifenmodus deaktivieren <(\`/loop Deaktivieren\`)> <${inter.member}>... nochmal versuchen? <❌>`
            ),
          })

        const success = queue.setRepeatMode(QueueRepeatMode.AUTOPLAY)
        baseEmbed.setAuthor({
          name: success
            ? errorMessage
            : await Translate(
                `Autoplay aktiviert, die Warteschlange wird automatisch mit ähnlichen Liedern zum aktuellen gefüllt <🔁>`
              ),
        })

        return inter.editReply({ embeds: [baseEmbed] })
      }
    }
  },
}
