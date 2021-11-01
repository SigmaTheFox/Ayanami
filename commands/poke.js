module.exports = {
  name: `poke`,
  category: "random",
  description: "Squishy :3",
  aliases: [`pokes`],
  usage: "(@User)",
  execute(ayanami, message, args) {
    const Discord = require('discord.js');
    const { randomKey } = require('../settings/config.json');
    const Gifs = require("../gifs.json");
    const RandomOrg = require("random-org");
    const random = new RandomOrg({ apiKey: randomKey });

    //let imageURL = Gifs.poke[Math.floor(Math.random() * Gifs.poke.length)];
    const user = `**${args.join(' ')}**` || `<@${message.mentions.users.first().id}>`;

    random.generateIntegers({ min: 0, max: Gifs.poke.length - 1, n: 1 })
      .then(function (r) {
        let imageURL = Gifs.poke[r.random.data];
         ayanami.logger.info(`Generated number for poke command: ${r.random.data}`);

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
          var description = `Hehehe [Source](${imageURL})`
          sendEmbed();
        } else {
          var description = `<@${message.author.id}> Pokes **${user}** [Source](${imageURL})`
          sendEmbed();
        }
      }).catch(err => {
         ayanami.logger.error(err)
        console.error(err)
        return message.reply('There was an error, please try again in a few minutes')
      })
  }
}