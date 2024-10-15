const { EmbedBuilder, InteractionType } = require('discord.js')
const { useQueue } = require('discord-player')
const { Translate } = require('../../process_tools')

module.exports = async (client, inter) => {
  await inter.deferReply({ ephemeral: true })
  if (inter.type === InteractionType.ApplicationCommand) {
    const DJ = client.config.opt.DJ
    const command = client.commands.get(inter.commandName)

    const errorEmbed = new EmbedBuilder().setColor('#00ffe8')

    if (!command) {
      errorEmbed.setDescription(
        await Translate(
          '<❌> | Fehler! Bitte kontaktiere die Entwickler! <@350897207261659137>'
        )
      )
      inter.editReply({ embeds: [errorEmbed], ephemeral: true })
      return client.slash.delete(inter.commandName)
    }

    if (
      command.permissions &&
      !inter.member.permissions.has(command.permissions)
    ) {
      errorEmbed.setDescription(
        await Translate(
          `<❌> | Du hast nicht die erforderlichen Berechtigungen, um diesen Befehl auszuführen`
        )
      )
      return inter.editReply({ embeds: [errorEmbed], ephemeral: true })
    }

    if (
      DJ.enabled &&
      DJ.commands.includes(command) &&
      !inter.member._roles.includes(
        inter.guild.roles.cache.find((x) => x.name === DJ.roleName).id
      )
    ) {
      errorEmbed.setDescription(
        await Translate(
          `<❌> | Dieser Befehl ist für Mitglieder mit der Rolle <\`${DJ.roleName}\`> reserviert`
        )
      )
      return inter.editReply({ embeds: [errorEmbed], ephemeral: true })
    }

    if (command.voiceChannel) {
      if (!inter.member.voice.channel) {
        errorEmbed.setDescription(
          await Translate(`<❌> | Du bist nicht in einem Sprachkanal`)
        )
        return inter.editReply({ embeds: [errorEmbed], ephemeral: true })
      }

      if (
        inter.guild.members.me.voice.channel &&
        inter.member.voice.channel.id !==
          inter.guild.members.me.voice.channel.id
      ) {
        errorEmbed.setDescription(
          await Translate(`<❌> | Du bist nicht im selben Sprachkanal`)
        )
        return inter.editReply({ embeds: [errorEmbed], ephemeral: true })
      }
    }

    command.execute({ inter, client })
  } else if (inter.type === InteractionType.MessageComponent) {
    const customId = inter.customId
    if (!customId) return

    const queue = useQueue(inter.guild)
    const path = `../../buttons/${customId}.js`

    delete require.cache[require.resolve(path)]
    const button = require(path)
    if (button) return button({ client, inter, customId, queue })
  }
}
