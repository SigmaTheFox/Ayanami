module.exports = {
  name: `baka`,
  category: "random",
  description: "It's not like I... Whatever.",
  usage: "(@User)",
  execute(ayanami, message, args) {
    // Imports the emojis database file and gives them a name used to call them.
    const Gifs = require("../gifs.json");
    const Discord = require('discord.js');
    const { randomKey } = require('../settings/config.json');
    const { baka } = require("../emojis.json");
    const RandomOrg = require("random-org");
    const logs = require('../modules/logger');
    const random = new RandomOrg({ apiKey: randomKey });

    //let imageURL = Gifs.baka[Math.floor(Math.random() * Gifs.baka.length)];
    const user = `**${args.join(' ')}**` || `<@${message.mentions.users.first().id}>`;

    random.generateIntegers({ min: 0, max: Gifs.baka.length - 1, n: 1 })
      .then(function (result) {
        let imageURL = Gifs.baka[result.random.data];
        logs.info(`Generated number for baka command: ${result.random.data}`);

        function sendEmbed() {
          const embed = new Discord.MessageEmbed()
            .setAuthor(ayanami.user.username, ayanami.user.displayAvatarURL({ dynamic: true }))
            .setDescription(description)
            .setImage(imageURL)
            .setColor(45055);
          message.channel.send({ embed });
        }

        // Sends the embed with the randomly generated image/gif.
        if (user === "****" || !user) {
          var description = `Baka baka baaaka!!! ${ayanami.emojis.cache.get(baka)} [Source](${imageURL})`
          sendEmbed();
        } else {
          var description = `${user} wa baka! ${ayanami.emojis.cache.get(baka)} [Source](${imageURL})`
          sendEmbed();
        }
      }).catch(err => {
        logs.error(err)
        console.error(err)
        return message.reply('There was an error, please try again in a few minutes')
      })
  }
}