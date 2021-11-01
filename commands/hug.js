module.exports = {
  name: `hug`,
  category: "random",
  description: "Give someone a hug.",
  aliases: [`hugs`],
  usage: "(@User)",
  execute(ayanami, message, args) {
    // Imports the emojis database file and gives them a name used to call them.
    const Gifs = require("../gifs.json");
    const Discord = require('discord.js');
    const Emote = require("../emojis.json");
    const { randomKey } = require('../settings/config.json');
    const heart = ayanami.emojis.cache.get(Emote.ayanamiheart);
    const RandomOrg = require("random-org");
    const random = new RandomOrg({ apiKey: randomKey });

    const user = args.join(' ');

    random.generateIntegers({ min: 0, max: Gifs.hug.length - 1, n: 1 })
      .then(function (r) {
        let imageURL = Gifs.hug[r.random.data];
         ayanami.logger.info(`Generated number for hug command: ${r.random.data}`);

        function sendEmbed() {
          const embed = new Discord.MessageEmbed()
            .setAuthor(ayanami.user.username, ayanami.user.displayAvatarURL({ format: 'png', size: 2048 }))
            .setDescription(description)
            .setImage(imageURL)
            .setColor(45055);
          return message.channel.send({ embeds: [embed] });
        }

        // Sends the embed with the randomly generated image/gif.
        if (user.length == 0 || !user) {
          var description = `Huggies!!! ${heart} [Source](${imageURL})`
          sendEmbed();
        } else {
          var description = `<@${message.author.id}> Hugs **${user}** [Source](${imageURL})`
          sendEmbed();
        }
      }).catch(err => {
         ayanami.logger.error(err)
        console.error(err)
        return message.reply('There was an error, please try again in a few minutes')
      })
  }
}