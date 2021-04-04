module.exports = {
    name: `fuck`,
    category: "nsfw",
    description: "Fuck someone either out of love or because you're feeling horny.",
    usage: "(@User)",
    execute(ayanami, message, args) {
        // Imports the emojis database file and gives them a name used to call them.
        const Gifs = require("../gifs.json");
        const Discord = require('discord.js');
        const Emote = require("../emojis.json");
        const { randomKey } = require('../settings/config.json');
        const RandomOrg = require("random-org");
        const random = new RandomOrg({ apiKey: randomKey });

        if (!message.channel.nsfw && message.channel.type !== "dm") {
            message.react("💢");
            return message.reply("Commander... I know that you like exhibitionism... But please go have sex in the NSFW channel.");
        }

        //let imageURL = Gifs.fuck[Math.floor(Math.random() * Gifs.fuck.length)];
        const user = `**${args.join(' ')}**` || `<@${message.mentions.users.first().id}>`;

        random.generateIntegers({ min: 0, max: Gifs.fuck.length - 1, n: 1 })
            .then(function (r) {
                let imageURL = Gifs.fuck[r.random.data];
                 ayanami.logger.info(`Generated number for fuck command: ${r.random.data}`);

                function sendEmbed() {
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(ayanami.user.username, ayanami.user.displayAvatarURL({ format: 'png', size: 2048 }))
                        .setDescription(description)
                        .setImage(imageURL)
                        .setColor(45055);
                    return message.channel.send({ embed });
                }

                // Sends the embed with the randomly generated image/gif.
                if (user === "****" || !user) {
                    var description = `<@${message.author.id}> seems to be fucking a ghost. [Source](${imageURL})`
                    sendEmbed();
                } else if (user === message.author.id) {
                    var description = `<@${message.author.id}> fucked... themselves? I feel bad for you. [Source](${imageURL})`
                    sendEmbed();
                } else {
                    var description = `<@${message.author.id}> fucks ${user}. [Source](${imageURL})`
                    sendEmbed();
                }
            }).catch(err => {
                 ayanami.logger.error(err)
                console.error(err)
                return message.reply('There was an error, please try again in a few minutes')
            })
    }
}