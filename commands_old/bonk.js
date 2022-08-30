module.exports = {
    name: `bonk`,
    category: "random",
    description: "Get bonked!",
    aliases: [`hit`],
    usage: "(@User)",
    execute(ayanami, message, args) {
        const Discord = require('discord.js');
        const { randomKey } = require('../settings/config.json');
        const { bonk } = require("../json/gifs.json");
        const RandomOrg = require("random-org");
        const random = new RandomOrg({ apiKey: randomKey });

        const user = args.join(' ');

        random.generateIntegers({ min: 0, max: bonk.length - 1, n: 1 })
            .then(function (r) {
                let imageURL = bonk[r.random.data];
                ayanami.logger.info(`Generated number for bonk command: ${r.random.data}`);

                function sendEmbed() {
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(ayanami.user.username, ayanami.user.displayAvatarURL({ dynamic: true }))
                        .setDescription(description)
                        .setImage(imageURL)
                        .setColor(45055);
                    return message.channel.send({ embeds: [embed] });
                }

                // Sends the embed with the randomly generated image/gif.
                if (user.length == 0 || !user) {
                    var description = `Get bonked! [Source](${imageURL})`
                    sendEmbed();
                } else {
                    var description = `<@${message.author.id}> bonks **${user}** [Source](${imageURL})`
                    sendEmbed();
                }
            }).catch(err => {
                ayanami.logger.error(err)
                console.error(err)
                return message.reply('There was an error, please try again in a few minutes')
            })
    }
}