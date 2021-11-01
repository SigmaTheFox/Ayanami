module.exports = {
  name: `baka`,
  category: "random",
  description: "It's not like I... Whatever.",
  usage: "(@User)",
  execute(ayanami, message, args) {
    const Gifs = require("../gifs.json");
    const Discord = require('discord.js');
    const { randomKey } = require('../settings/config.json');
    const { baka } = require("../emojis.json");
    const RandomOrg = require("random-org");
    const random = new RandomOrg({ apiKey: randomKey });

    const user = args.join(' ');

    random.generateIntegers({ min: 0, max: Gifs.baka.length - 1, n: 1 })
      .then(function (result) {
        let imageURL = Gifs.baka[result.random.data];
        ayanami.logger.info(`Generated number for baka command: ${result.random.data}`);

        function sendEmbed() {
          const embed = new Discord.MessageEmbed()
            .setAuthor(ayanami.user.username, ayanami.user.displayAvatarURL({ dynamic: true }))
            .setDescription(description)
            .setImage(imageURL)
            .setColor(45055);
          message.channel.send({ embeds: [embed] });
        }

        // Sends the embed with the randomly generated image/gif.
        if (user.length == 0 || !user) {
          var description = `Baka baka baaaka!!! ${ayanami.emojis.cache.get(baka)} [Source](${imageURL})`
          sendEmbed();
        } else {
          var description = `**${user}** wa baka! ${ayanami.emojis.cache.get(baka)} [Source](${imageURL})`
          sendEmbed();
        }
      }).catch(err => {
        ayanami.logger.error(err)
        console.error(err)
        return message.reply('There was an error, please try again in a few minutes')
      })
  }
}