const Discord = require("discord.js");
const { DBKey } = require('../settings/config.json');
const Booru = require('../modules/booru');

const booru = new Booru(DBKey, 'SigmaTheFox');

module.exports = {
  name: `danbooru`,
  category: "nsfw",
  description: "I see what you're doing there.\n**Use 'rating:explicit', 'rating:quetionable' or 'rating:safe' to get a random image of the respective category.**",
  aliases: [`db`, `danb`, `dbooru`],
  execute(ayanami, message, args) {

    // Checks if the channel is set to NSFW.
    if (!message.channel.nsfw && message.channel.type !== "DM") {
      message.react("💢");
      return message.reply("Commander, please go to the lewds channel or DMs for this.");
    }

    if (args.length >= 1) return message.reply("You can't use any tags with Danbooru, to use tags use Gelbooru or Rule34");

    // Searches the booru using the argument provided by the message author.
    booru.search("db", args.concat(['-shota*']))
      .then(image => {
        // Creates an embed that sends the image.
        if (image.URL.includes('webm') || image.URL.includes('mp4')) {
          return message.channel.send(image.URL);
        } else {
          const embed = new Discord.MessageEmbed()
            .setAuthor(`Danbooru`)
            .setDescription(`[Image URL](${image.booruURL})`)
            .setImage(image.URL)
            .setColor(45055);
          return message.channel.send({ embeds: [embed] });
        }
        // Catches errors and responds to them (sometimes).
      })
      .catch(err => {
         ayanami.logger.error(err);
        return message.reply(`I'm sorry commander... I didn't find anything for **${args[0]}**.`);
      });
  }
};
