const {
  ApplicationCommandOptionType,
  ActionRowBuilder,
  ButtonBuilder,
  ChannelType,
  EmbedBuilder,
  PermissionsBitField,
} = require('discord.js')
const { Translate } = require('../../process_tools')

module.exports = {
  name: 'controller',
  description: 'Sende Musiksteuerung an einen Kanal',
  voiceChannel: false,
  permissions: PermissionsBitField.Flags.ManageMessages,
  options: [
    {
      name: 'channel',
      description: 'Der Textkanal, in den du es senden möchtest',
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
  ],

  async execute({ inter }) {
    const channel = inter.options.getChannel('channel')
    if (channel.type !== ChannelType.GuildText)
      return inter.editReply({
        content: await Translate(
          `Du musst es in einen Textkanal senden.. <❌>`
        ),
      })

    const embed = new EmbedBuilder()
      .setTitle(
        await Translate('Steuere deine Musik mit den untenstehenden Tasten!')
      )
      .setImage(inter.guild.iconURL({ size: 4096, dynamic: true }))
      .setColor('#00ffe8')
      .setFooter({
        text: await Translate(
          'Musik kommt zuerst - Mit Herz gemacht von der Community <❤️>'
        ),
        iconURL: inter.member.avatarURL({ dynamic: true }),
      })

    inter.editReply({
      content: await Translate(`Sende Steuerung an <${channel}>... <✅>`),
    })

    let EmojiState = client.config.app.enableEmojis

    const emojis = client.config.emojis

    emojis ? (EmojiState = EmojiState) : (EmojiState = false)

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

    const save = new ButtonBuilder()
      .setLabel(EmojiState ? emojis.savetrack : 'Speichern')
      .setCustomId('savetrack')
      .setStyle('Success')

    const volumeup = new ButtonBuilder()
      .setLabel(EmojiState ? emojis.volumeUp : 'Lauter')
      .setCustomId('volumeup')
      .setStyle('Primary')

    const volumedown = new ButtonBuilder()
      .setLabel(EmojiState ? emojis.volumeDown : 'Leiser')
      .setCustomId('volumedown')
      .setStyle('Primary')

    const loop = new ButtonBuilder()
      .setLabel(EmojiState ? emojis.loop : 'Wiederholen')
      .setCustomId('loop')
      .setStyle('Danger')

    const np = new ButtonBuilder()
      .setLabel('Jetzt läuft')
      .setCustomId('nowplaying')
      .setStyle('Secondary')

    const queuebutton = new ButtonBuilder()
      .setLabel('Warteschlange')
      .setCustomId('queue')
      .setStyle('Secondary')

    const lyrics = new ButtonBuilder()
      .setLabel('Songtext')
      .setCustomId('Lyrics')
      .setStyle('Primary')

    const shuffle = new ButtonBuilder()
      .setLabel('Mischen')
      .setCustomId('shuffle')
      .setStyle('Success')

    const stop = new ButtonBuilder()
      .setLabel('Stop')
      .setCustomId('stop')
      .setStyle('Danger')

    const row1 = new ActionRowBuilder().addComponents(
      back,
      resumepause,
      skip,
      stop,
      save
    )
    const row2 = new ActionRowBuilder().addComponents(
      volumedown,
      volumeup,
      loop
    )
    const row3 = new ActionRowBuilder().addComponents(
      lyrics,
      shuffle,
      queuebutton,
      np
    )

    channel.send({ embeds: [embed], components: [row1, row2, row3] })
  },
}
