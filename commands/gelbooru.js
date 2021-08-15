const Discord = require('discord.js');
const { GBKey } = require('../settings/config.json');
const Booru = require('../modules/booru');

const booru = new Booru(GBKey);

module.exports = {
    name: `gelbooru`,
    category: "nsfw",
    description: "Use this one instead of Danbooru for tags.",
    aliases: [`gb`, `gelb`, `gbooru`],
    usage: "(Tag1) (Tag2) (Tag3) ...",
    execute(ayanami, message, args) {

        // Checks if the channel is set to NSFW.
        if (!message.channel.nsfw && message.channel.type !== "DM") {
            message.react('💢');
            return message.reply('Commander, please go to the lewds channel or DMs for this.');
        }

        // Stops people from using Loli and Gore as a tag.
        if (/\bLOLI\b/gi.test(message.content)
            || /\bGORE\b/gi.test(message.content)
            || /\bSHOTA\b/gi.test(message.content)) return message.reply("… I don't really want to come close to you, Commander. Lolis, Shota and Gore are not allowed...");

        // Searches the booru using the arguments provided by the message author.
        booru.search('gb', args.concat(["-loli*", "-shota*", "-young", "-gore", "-amputee", "-furry", "-anthro", "-rating:safe"]))
            .then(image => {
                // Creates an embed that sends the image.
                if (image.URL.includes('webm') || image.URL.includes('mp4')) {
                    return message.channel.send(image.URL)
                } else {
                    const embed = new Discord.MessageEmbed()
                        .setAuthor(`Gelbooru`)
                        .setDescription(`[Image URL](${image.booruURL})`)
                        .setImage(image.URL)
                        .setColor(45055);
                    return message.channel.send({ embeds: [embed] });
                }
                // Catches errors and responds to them (sometimes).
            }).catch(err => {
                 ayanami.logger.error(err)
                return message.reply(`I'm sorry commander... I didn't find anything for **${args.join(", ")}**.`);
            })
    }
}