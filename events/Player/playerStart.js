const { ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js')
const { Translate } = require('../../process_tools')

module.exports = (queue, track) => {
  if (!client.config.app.loopMessage && queue.repeatMode !== 0) return

  let EmojiState = client.config.app.enableEmojis

  const emojis = client.config.emojis

  emojis ? (EmojiState = EmojiState) : (EmojiState = false)
  ;(async () => {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: await Translate(
          `Starte Wiedergabe von <${track.title}> in <${queue.channel.name}> <🎧>`
        ),
        iconURL: track.thumbnail,
      })
      .setColor('#00ffe8')

    const back = new ButtonBuilder()
      .setLabel(EmojiState ? emojis.back : 'Zurück')
      .setCustomId('back')
      .setStyle('Primary')

    const skip = new ButtonBuilder()
      .setLabel(EmojiState ? emojis.skip : 'Überspringen')
      .setCustomId('skip')
      .setStyle('Primary')

    const resumepause = new ButtonBuilder()
      .setLabel(EmojiState ? emojis.ResumePause : 'Fortsetzen & Pause')
      .setCustomId('resume&pause')
      .setStyle('Danger')

    const loop = new ButtonBuilder()
      .setLabel(EmojiState ? emojis.loop : 'Schleife')
      .setCustomId('loop')
      .setStyle('Danger')

    const lyrics = new ButtonBuilder()
      .setLabel(await Translate('Liedtext'))
      .setCustomId('lyrics')
      .setStyle('Secondary')

    const row1 = new ActionRowBuilder().addComponents(
      back,
      loop,
      resumepause,
      skip,
      lyrics
    )
    queue.metadata.channel.send({ embeds: [embed], components: [row1] })
  })()
}
