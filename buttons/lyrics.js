const { EmbedBuilder } = require('discord.js')
const { useMainPlayer } = require('discord-player')
const { Translate } = require('../process_tools')

module.exports = async ({ inter, queue }) => {
  const player = useMainPlayer()
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
          `Fehler! Bitte kontaktieren Sie die Entwickler! | <❌>`
        ),
      })
    })

  const lyrics = results?.[0]
  if (!lyrics?.plainLyrics)
    return inter.editReply({
      content: await Translate(
        `Keine Texte gefunden für <${queue.currentTrack.title}>... nochmal versuchen? <❌>`
      ),
    })

  const trimmedLyrics = lyrics.plainLyrics.substring(0, 1997)

  const embed = new EmbedBuilder()
    .setTitle(`Texte für ${queue.currentTrack.title}`)
    .setAuthor({
      name: lyrics.artistName,
    })
    .setDescription(
      trimmedLyrics.length === 1997 ? `${trimmedLyrics}...` : trimmedLyrics
    )
    .setFooter({
      text: await Translate(
        'Musik kommt zuerst - Mit Herz von der Community gemacht <❤️>'
      ),
      iconURL: inter.member.avatarURL({ dynamic: true }),
    })
    .setTimestamp()
    .setColor('#00ffe8')

  return inter.editReply({ embeds: [embed] })
}
