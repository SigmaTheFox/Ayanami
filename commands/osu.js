const Discord = require('discord.js');
const osu = require('node-osu');
const logs = require('../modules/logger');
const { osuKey } = require('../settings/config.json');
const { OsuDB } = require('../modules/dbObjects');

var osuApi = new osu.Api(osuKey, {
    notFoundAsError: false,
    completeScores: false
})

module.exports = {
    name: `osu`,
    category: "games",
    description: "View your or someone else's OSU! stats.",
    usage: `<username>`,
    async execute(ayanami, message, args) {
        const username = args.join(" ");
        const discordTag = message.author;

        await OsuDB.findOne({ where: { discord_id: discordTag.id } })
            .then(async os => {
                if (!os && !username) {
                    return message.reply(`Please specify a username or add yours with the **osuadd** command.`)
                }

                function sendEmbed() {
                    try {
                        osuApi.getUser({ u: osuUser }).then(user => {

                            if (!user.name) return message.channel.send(`The user **${osuUser}** was not found!`);

                            const embed = new Discord.MessageEmbed()
                                .setAuthor(user.name, `https://a.ppy.sh/${user.id}`)
                                .setTitle('OSU')
                                .addFields({
                                    name: '❯\u2000\Stats',
                                    value: `•\u2000\**Level:** ${user.level}\n\•\u2000\**Play Count:** ${user.counts.plays}\n\•\u2000\**Accuracy:** ${user.accuracyFormatted}`,
                                    inline: true
                                },
                                {
                                    name: '❯\u2000\PP',
                                    value: `•\u2000\**Raw:** ${user.pp.raw} PP\n\•\u2000\**Rank:** ${user.pp.rank}\n\•\u2000\**Country Rank:** ${user.pp.countryRank} ${user.country}`,
                                    inline: true
                                },
                                {
                                    name: '❯\u2000\Scores',
                                    value: `•\u2000\**Ranked:** ${user.scores.ranked}\n\•\u2000\**Total:** ${user.scores.total}`,
                                    inline: true
                                },
                                {
                                    name: '❯\u2000\Map Ranks',
                                    value: `•\u2000\**SS:** ${user.counts.SS}\n\•\u2000\**S:** ${user.counts.S}\n\•\u2000\**A:** ${user.counts.A}`,
                                    inline: true
                                })
                                .setThumbnail(`https://a.ppy.sh/${user.id}`)
                                .setColor('#ff66aa')
                            return message.channel.send({ embed });
                        }).catch(err => {
                            logs.error(err)
                            return message.channel.send(`The user **${osuUser}** was not found!`);
                        });
                    } catch (err) {
                        return message.channel.send('There was an error using this command.');
                    }
                }

                // If there is a username stored it will use this.
                if (!username) {
                    var osuUser = os.get('osu_id')
                    return sendEmbed();
                }
                // If there is an argument it'll use this instead
                var osuUser = username
                return sendEmbed();

            })
    }
}