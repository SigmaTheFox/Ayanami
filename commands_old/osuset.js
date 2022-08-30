const { OsuDB } = require("../modules/dbObjects");

module.exports = {
    name: `osuset`,
    category: "games",
    description: "You can store your OSU! username for future use with this command.",
    args: true,
    usage: `<username>`,
    async execute(ayanami, message, args) {
        const username = args.join(" ");
        const discordTag = message.author;

        const tag = await OsuDB.findOrCreate({ where: { discord_id: discordTag.id }, defaults: { osu_id: username } })
            .then(async function (result) {
                var author = result[0],
                    created = result[1];

                if (!created) {
                    OsuDB.update({
                        osu_id: username
                    },
                        {
                            where: {
                                discord_id: discordTag.id
                            }
                        });
                    message.reply(`You set **${username}** as your default osu name.`);
                    return
                }
                return message.reply(`You set **${username}** as your default osu name.`);
            })
    }
}