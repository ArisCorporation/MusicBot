const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js')
const { AudioFilters, useQueue } = require('discord-player')
const { Translate } = require('../../process_tools')

module.exports = {
  name: 'filter',
  description: 'Füge einen Filter zu deinem Track hinzu',
  voiceChannel: true,
  options: [
    {
      name: 'filter',
      description: 'Der Filter, den du hinzufügen möchtest',
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        ...Object.keys(AudioFilters.filters)
          .map((m) => Object({ name: m, value: m }))
          .splice(0, 25),
      ],
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

    const actualFilter = queue.filters.ffmpeg.getFiltersEnabled()[0]
    const selectedFilter = inter.options.getString('filter')

    const filters = []
    queue.filters.ffmpeg.getFiltersDisabled().forEach((f) => filters.push(f))
    queue.filters.ffmpeg.getFiltersEnabled().forEach((f) => filters.push(f))

    const filter = filters.find(
      (x) => x.toLowerCase() === selectedFilter.toLowerCase().toString()
    )

    let msg =
      (await Translate(
        `Dieser Filter existiert nicht <${inter.member}>... nochmal versuchen? <❌ \n>`
      )) +
      (actualFilter
        ? await Translate(`Aktuell aktiver Filter: <**${actualFilter}**. \n>`)
        : '') +
      (await Translate(`Liste der verfügbaren Filter:`))
    filters.forEach((f) => (msg += `- **${f}**`))

    if (!filter) return inter.editReply({ content: msg })

    await queue.filters.ffmpeg.toggle(filter)

    const filterEmbed = new EmbedBuilder()
      .setAuthor({
        name: await Translate(
          `Der Filter <${filter}> ist jetzt <${
            queue.filters.ffmpeg.isEnabled(filter) ? 'aktiviert' : 'deaktiviert'
          }> <✅\n> *Erinnerung: Je länger die Musik, desto länger dauert dies.*`
        ),
      })
      .setColor('#00ffe8')

    return inter.editReply({ embeds: [filterEmbed] })
  },
}
