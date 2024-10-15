const { EmbedBuilder } = require('discord.js')
const { Translate } = require('../../process_tools')

module.exports = {
  name: 'help',
  description: 'All the commands this bot has!',
  showHelp: false,

  async execute({ client, inter }) {
    const commands = client.commands.filter((x) => x.showHelp !== false)

    const embed = new EmbedBuilder()
      .setColor('#00ffe8')
      .setAuthor({
        name: client.user.username,
        iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }),
      })
      .setDescription(
        await Translate(
          'Bei Fragen oder Anregungen wende dich bitte an die Entwickler! <@350897207261659137>'
        )
      )
      .addFields([
        {
          name: `Aktiv - ${commands.size}`,
          value: commands.map((x) => `\`${x.name}\``).join(' | '),
        },
      ])
      .setTimestamp()
      .setFooter({
        text: await Translate(
          'Musik kommt zuerst - Mit Herz gemacht von der Community <❤️>'
        ),
        iconURL: inter.member.avatarURL({ dynamic: true }),
      })

    inter.editReply({ embeds: [embed] })
  },
}
