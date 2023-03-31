const {
  SlashCommandBuilder,
  Client,
  CommandInteraction,
  EmbedBuilder,
} = require('discord.js')
const osu = require('node-osu')
const { osuKey } = require('../settings/config.json')
const { OsuDB } = require('../modules/dbObjects.js')
const osuIcon =
  'https://cdn.discordapp.com/attachments/310843189357445122/813338443173986314/1200px-OsuLogo_2015.svg.png'

let osuApi = new osu.Api(osuKey, {
  notFoundAsError: false,
  completeScores: false,
})

async function sendEmbed(interaction, user) {
  let mode = parseInt(interaction.options.getString('mode')),
    modeTitle = ['OSU!', 'TAIKO', 'CATCH THE BEAT', 'OSU!MANIA']

  try {
    let osuUser = await osuApi.getUser({ m: mode, u: user })
    if (!osuUser.name)
      return interaction.reply({
        content: `The user **${user}** was not found`,
        ephemeral: true,
      })

    let embed = new EmbedBuilder()
      .setAuthor({ name: osuUser.name, iconURL: osuIcon })
      .setTitle(modeTitle[mode])
      .addFields(
        {
          name: '❯\u2000Stats',
          value: `•\u2000\**Level:** ${osuUser.level}\n\•\u2000\**Play Count:** ${osuUser.counts.plays}\n\•\u2000\**Accuracy:** ${osuUser.accuracyFormatted}`,
          inline: true,
        },
        {
          name: '❯\u2000PP',
          value: `•\u2000\**Raw:** ${osuUser.pp.raw} PP\n\•\u2000\**Rank:** ${osuUser.pp.rank}\n\•\u2000\**Country Rank:** ${osuUser.pp.countryRank} ${osuUser.country}`,
          inline: true,
        },
        {
          name: '❯\u2000Scores',
          value: `•\u2000\**Ranked:** ${osuUser.scores.ranked}\n\•\u2000\**Total:** ${osuUser.scores.total}`,
          inline: true,
        },
        {
          name: '❯\u2000Map Ranks',
          value: `•\u2000\**SS:** ${osuUser.counts.SS}\n\•\u2000\**S:** ${osuUser.counts.S}\n\•\u2000\**A:** ${osuUser.counts.A}`,
          inline: true,
        }
      )
      .setThumbnail(`https://a.ppy.sh/${osuUser.id}`)
      .setColor('#ff66aa')

    interaction.reply({ embeds: [embed] })
  } catch (err) {
    return message.reply({
      content: 'There was an error using this command',
      ephemeral: true,
    })
  }
}

module.exports = {
  global: true,
  data: new SlashCommandBuilder()
    .setName('osu')
    .setDescription("View your or someone else's OSU! stats.")
    .addSubcommand((cmd) =>
      cmd
        .setName('get')
        .setDescription("View your or someone else's osu! stats.")
        .addStringOption((opt) =>
          opt
            .setName('mode')
            .setDescription('The osu! game mode')
            .setRequired(true)
            .addChoices(
              { name: 'osu!', value: '0' },
              { name: 'Taiko', value: '1' },
              { name: 'Catch the Beat', value: '2' },
              { name: 'osu!mania', value: '3' }
            )
        )
        .addStringOption((opt) =>
          opt.setName('username').setDescription('The osu! username')
        )
    )
    .addSubcommand((cmd) =>
      cmd
        .setName('set')
        .setDescription('Store your osu! username for future use')
        .addStringOption((opt) =>
          opt
            .setName('username')
            .setDescription('Your osu! username')
            .setRequired(true)
        )
    ),
  /**
   * @param {Client} ayanami
   * @param {CommandInteraction} interaction
   */
  async execute(ayanami, interaction) {
    let username = interaction.options.getString('username'),
      discordUser = interaction.user

    if (interaction.options.getSubcommand() === 'get') {
      let username = interaction.options.getString('username'),
        os = await OsuDB.findOne({ where: { discord_id: discordUser.id } })

      if (!os && !username)
        return interaction.reply(
          `Please specify a username or add yours with the **/osu set** command.`
        )
      if (!username) return sendEmbed(interaction, os.get('osu_id'))
      else return sendEmbed(interaction, username)
    } else if (interaction.options.getSubcommand() === 'set') {
      let result = await OsuDB.findOrCreate({
        where: { discord_id: discordUser.id },
        defaults: { osu_id: username },
      })
      let created = result[1]

      if (!created) {
        OsuDB.update(
          { osu_id: username },
          { where: { discord_id: discordUser.id } }
        )
        return interaction.reply({
          content: `You set **${username}** as your default osu! username`,
          ephemeral: true,
        })
      }
      return interaction.reply({
        content: `You set **${username}** as your default osu! username`,
        ephemeral: true,
      })
    }
  },
}
