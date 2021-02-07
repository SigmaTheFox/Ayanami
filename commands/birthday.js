module.exports = {
  name: `birthday`,
  aliases: [`bday`],
  execute(ayanami, message, args) {
    const Discord = require('discord.js');
    const { birthday } = require("../gifs.json");
    const Emote = require("../emojis.json");
    const { randomKey } = require('../settings/config.json');
    const heart = ayanami.emojis.cache.get(Emote.ayanamiheart);
    const RandomOrg = require("random-org");
    const logs = require('../modules/logger');
    const random = new RandomOrg({ apiKey: randomKey });

    const user = `**${args.join(' ')}**` || `<@${message.mentions.users.first().id}>`;

    random.generateIntegers({ min: 0, max: birthday.length - 1, n: 1 })
      .then(function (r) {
        let imageURL = birthday[r.random.data];
        logs.info(`Generated number for birthday command: ${r.random.data}`);

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
          var description = `Happy birthday!!! ${heart}. [Source](${imageURL})`
          sendEmbed();
        }
        else if (user === "497318136895242240") {
          var description = `Thank you very much for the birthday wishes <@${message.author.id}>. I'm very happy to be here with you all!`
          sendEmbed();
        } else {
          var description = `Happy birthday ${user}!!! ${heart} Make sure to eat lots of cake! [Source](${imageURL})`
          sendEmbed();
        }
      }).catch(err => {
        logs.error(err)
        console.error(err)
        return message.reply('There was an error, please try again in a few minutes')
      })
  }
}