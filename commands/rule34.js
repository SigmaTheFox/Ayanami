const Discord = require('discord.js');
const logs = require('../modules/logger');
const Booru = require('../modules/booru');

const booru = new Booru();

module.exports = {
    name: `rule34`,
    category: "nsfw",
    description: "Really? Gelbooru wasn't enough?",
    aliases: [`r34`],
    usage: "(Tag 1) (Tag 2) ...",
    execute(ayanami, message, args) {

        // Checks if the channel is set to NSFW.
        if (!message.channel.nsfw && message.channel.type !== "dm") {
            message.react('💢');
            return message.reply('Commander, please go in the lewds channel for this.');
        }

        // Stops people from using Loli and Gore as a tag.
        if (/\bLOLI\b/gi.test(message.content)
            || /\bGORE\b/gi.test(message.content)
            || /\bSHOTA\b/gi.test(message.content)) return message.reply("… I don't really want to come close to you, Commander. Lolis, Shota and Gore are not allowed...");

        // Searches the booru using the arguments provided by the message author.
        booru.search('r34', args.concat(["-loli", "-young", "-gore", "-amputee", "-furry", "-shota", "-anthro"]))
            .then(image => {                    // Creates an embed that sends the image.
                if (image.URL.includes('webm') || image.URL.includes('mp4')) {
                    return message.channel.send(image.URL)
                } else {
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(`Rule34`)
                        .setDescription(`[Image URL](${image.booruURL})`)
                        .setImage(image.URL)
                        .setColor(45055);
                    return message.channel.send({ embed });
                }

                // Catches errors and responds to them (sometimes).
            }).catch(err => {
                logs.error(err)
                return message.reply(`I'm sorry commander... I didn't find anything for **${args.join(", ")}**.`);
            })
    }
}