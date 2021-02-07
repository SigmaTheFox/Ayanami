module.exports = {
  name: `cuddle`,
  aliases: [`cuddles`],
  execute(ayanami, message, args) {
    // Imports the emojis database file and gives them a name used to call them.
    const Gifs = require("../gifs.json");
    const Discord = require('discord.js');
    const Emote = require("../emojis.json");
    const logs = require('../modules/logger');
    const { randomKey } = require('../settings/config.json');
    const heart = ayanami.emojis.cache.get(Emote.ayanamiheart);
    const RandomOrg = require("random-org");
    const random = new RandomOrg({ apiKey: randomKey });

    //let imageURL = Gifs.cuddle[Math.floor(Math.random() * Gifs.cuddle.length)];
    const user = `**${args.join(' ')}**` || `<@${message.mentions.users.first().id}>`;

    random.generateIntegers({ min: 0, max: Gifs.cuddle.length - 1, n: 1 })
      .then(function (result) {
        let imageURL = Gifs.cuddle[result.random.data];

        logs.info(`Generated number for cuddle command: ${result.random.data}`);

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
          var description = `Cuddly snuggly!!! ${heart} [Source](${imageURL})`
          sendEmbed();
        } else {
          var description = `<@${message.author.id}> Cuddles with ${user} ${heart} [Source](${imageURL})`
          sendEmbed();
        }
      }).catch(err => {
        logs.error(err)
        console.error(err)
        return message.reply('There was an error, please try again in a few minutes')
      })
  }
}