const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js')
const { useQueue } = require('discord-player')
const { Translate } = require('../../process_tools')

module.exports = {
  name: 'nowplaying',
  description: 'Sieh dir an, welches Lied gerade gespielt wird!',
  voiceChannel: true,

  async execute({ inter }) {
    const queue = useQueue(inter.guild)
    if (!queue?.isPlaying())
      return inter.editReply({
        content: await Translate(
          `Zurzeit wird keine Musik gespielt <${inter.member}>... nochmal versuchen? <❌>`
        ),
      })

    const track = queue.currentTrack
    const methods = ['deaktiviert', 'Lied', 'Warteschlange']
    const timestamp = track.duration
    const trackDuration =
      timestamp.progress == 'Infinity' ? 'unendlich (live)' : track.duration
    const progress = queue.node.createProgressBar()

    let EmojiState = client.config.app.enableEmojis

    const emojis = client.config?.emojis

    emojis ? (EmojiState = EmojiState) : (EmojiState = false)

    const embed = new EmbedBuilder()
      .setAuthor({
        name: track.title,
        iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }),
      })
      .setThumbnail(track.thumbnail)
      .setDescription(
        await Translate(
          `Lautstärke <**${
            queue.node.volume
          }**%> <\n> <Dauer **${trackDuration}**> <\n> Fortschritt <${progress}> <\n >Schleifenmodus <**${
            methods[queue.repeatMode]
          }**> <\n>Angefordert von <${track.requestedBy}>`
        )
      )
      .setFooter({
        text: await Translate(
          'Musik kommt zuerst - Mit Herz gemacht von der Community <❤️>'
        ),
        iconURL: inter.member.avatarURL({ dynamic: true }),
      })
      .setColor('#00ffe8')
      .setTimestamp()

    const saveButton = new ButtonBuilder()
      .setLabel(EmojiState ? emojis.savetrack : 'Dieses Lied speichern')
      .setCustomId('savetrack')
      .setStyle('Danger')

    const volumeup = new ButtonBuilder()
      .setLabel(EmojiState ? emojis.volumeUp : 'Lauter')
      .setCustomId('volumeup')
      .setStyle('Primary')

    const volumedown = new ButtonBuilder()
      .setLabel(EmojiState ? emojis.volumeDown : 'Leiser')
      .setCustomId('volumedown')
      .setStyle('Primary')

    const loop = new ButtonBuilder()
      .setLabel(EmojiState ? emojis.loop : 'Schleife')
      .setCustomId('loop')
      .setStyle('Danger')

    const resumepause = new ButtonBuilder()
      .setLabel(EmojiState ? emojis.ResumePause : 'Fortsetzen <&> Pause')
      .setCustomId('resume&pause')
      .setStyle('Success')

    const row = new ActionRowBuilder().addComponents(
      volumedown,
      resumepause,
      volumeup,
      loop,
      saveButton
    )
    inter.editReply({ embeds: [embed], components: [row] })
  },
}
