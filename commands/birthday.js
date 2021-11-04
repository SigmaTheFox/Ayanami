module.exports = {
  name: `birthday`,
  aliases: [`bday`],
  category: "random",
  description: "Wish someone a happy birthday.",
  usage: "(@User)",
  execute(ayanami, message, args) {
    const Discord = require('discord.js');
    const { birthday } = require("../gifs.json");
    const Emote = require("../emojis.json");
    const { randomKey } = require('../settings/config.json');
    const heart = ayanami.emojis.cache.get(Emote.ayanamiheart);
    const RandomOrg = require("random-org");
    const random = new RandomOrg({ apiKey: randomKey });

    const user = args.join(' ');

    random.generateIntegers({ min: 0, max: birthday.length - 1, n: 1 })
      .then(function (r) {
        let imageURL = birthday[r.random.data];
        ayanami.logger.info(`Generated number for birthday command: ${r.random.data}`);

        function sendEmbed() {
          const embed = new Discord.MessageEmbed()
            .setAuthor(ayanami.user.username, ayanami.user.displayAvatarURL({ format: 'png', size: 2048 }))
            .setDescription(description)
            .setImage(imageURL)
            .setColor(45055);
          return message.channel.send({ embeds: [embed] });
        }

        // Sends the embed with the randomly generated image/gif.
        let regex = new RegExp("<@!?&?" + ayanami.user.id + ">");
        if (user.length == 0 || !user) {
          var description = `Happy birthday!!! ${heart}. [Source](${imageURL})`
          sendEmbed();
        }
        else if (regex.test(user)) {
          var description = `Thank you very much for the birthday wishes <@${message.author.id}>. I'm very happy to be here with you all!`
          sendEmbed();
        }
        else {
          var description = `Happy birthday **${user}**!!! ${heart} Make sure to eat lots of cake! [Source](${imageURL})`
          sendEmbed();
        }
      }).catch(err => {
        ayanami.logger.error(err)
        console.error(err)
        return message.reply('There was an error, please try again in a few minutes')
      })
  }
}