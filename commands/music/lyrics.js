const { EmbedBuilder } = require('discord.js')
const { useMainPlayer, useQueue } = require('discord-player')
const { Translate } = require('../../process_tools')

module.exports = {
  name: 'lyrics',
  description: 'Hole die Liedtexte für den aktuellen Titel',
  voiceChannel: true,

  async execute({ inter }) {
    const player = useMainPlayer()
    const queue = useQueue(inter.guild)
    if (!queue?.isPlaying())
      return inter.editReply({
        content: await Translate(
          `Zurzeit wird keine Musik abgespielt <${inter.member}>... nochmal versuchen? <❌>`
        ),
      })

    const results = await player.lyrics
      .search({
        q: queue.currentTrack.title,
      })
      .catch(async (e) => {
        console.log(e)
        return inter.editReply({
          content: await Translate(
            `Fehler! Bitte kontaktiere die Entwickler! | <❌>`
          ),
        })
      })

    const lyrics = results?.[0]
    if (!lyrics?.plainLyrics)
      return inter.editReply({
        content: await Translate(
          `Keine Liedtexte gefunden für <${queue.currentTrack.title}>... nochmal versuchen? <❌>`
        ),
      })

    const trimmedLyrics = lyrics.plainLyrics.substring(0, 1997)

    const embed = new EmbedBuilder()
      .setTitle(await Translate(`Liedtexte für <${queue.currentTrack.title}>`))
      .setAuthor({
        name: lyrics.artistName,
      })
      .setDescription(
        trimmedLyrics.length === 1997 ? `${trimmedLyrics}...` : trimmedLyrics
      )
      .setFooter({
        text: await Translate(
          'Musik kommt zuerst - Mit Herz gemacht von der Community <❤️>'
        ),
        iconURL: inter.member.avatarURL({ dynamic: true }),
      })
      .setTimestamp()
      .setColor('#00ffe8')

    return inter.editReply({ embeds: [embed] })
  },
}
