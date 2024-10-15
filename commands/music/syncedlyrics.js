const { useMainPlayer, useQueue } = require('discord-player')
const { Translate } = require('../../process_tools')

module.exports = {
  name: 'syncedlyrics',
  description: 'Synchronisiere die Liedtexte mit dem Song',
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

    const metadataThread = queue.metadata.lyricsThread
    if (metadataThread && !metadataThread.archived)
      return inter.editReply({
        content: await Translate(
          `Liedtext-Thread bereits erstellt <${inter.member}>! <${queue.metadata.lyricsThread}>`
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
          `Keine Liedtexte gefunden für <${queue.currentTrack.title}>... nochmal versuchen? <❌>`
        ),
      })

    const thread = await queue.metadata.channel.threads.create({
      name: `Liedtexte von ${queue.currentTrack.title}`,
    })

    queue.setMetadata({
      channel: queue.metadata.channel,
      lyricsThread: thread,
    })

    const syncedLyrics = queue?.syncedLyrics(lyrics)
    syncedLyrics.onChange(async (lyrics) => {
      await thread.send({
        content: lyrics,
      })
    })

    syncedLyrics?.subscribe()

    return inter.editReply({
      content: await Translate(
        `Liedtexte erfolgreich synchronisiert in <${thread}>! <${inter.member}> <✅>`
      ),
    })
  },
}
