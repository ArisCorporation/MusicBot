const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js')
const { QueryType, useMainPlayer, useQueue } = require('discord-player')
const { Translate } = require('../../process_tools')

module.exports = {
  name: 'playnext',
  description: 'Spiele ein Lied direkt nach diesem',
  voiceChannel: true,
  options: [
    {
      name: 'song',
      description: 'Das Lied, das du als nächstes spielen möchtest',
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  async execute({ inter }) {
    const player = useMainPlayer()
    const queue = useQueue(inter.guild)

    if (!queue?.isPlaying())
      return inter.editReply({
        content: await Translate(
          `Zurzeit wird keine Musik gespielt <${inter.member}>... nochmal versuchen? <❌>`
        ),
      })

    const song = inter.options.getString('song')
    const res = await player.search(song, {
      requestedBy: inter.member,
      searchEngine: QueryType.AUTO,
    })

    if (!res?.tracks.length)
      return inter.editReply({
        content: await Translate(
          `Keine Ergebnisse gefunden <${inter.member}>... nochmal versuchen? <❌>`
        ),
      })

    if (res.playlist)
      return inter.editReply({
        content: await Translate(
          `Dieser Befehl unterstützt keine Playlists <${inter.member}>... nochmal versuchen? <❌>`
        ),
      })

    queue.insertTrack(res.tracks[0], 0)

    const playNextEmbed = new EmbedBuilder()
      .setAuthor({
        name: await Translate(
          `Der Titel wurde in die Warteschlange eingefügt... er wird als nächstes gespielt <🎧>`
        ),
      })
      .setColor('#00ffe8')

    await inter.editReply({ embeds: [playNextEmbed] })
  },
}
