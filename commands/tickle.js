module.exports = {
  name: `tickle`,
  category: "random",
  description: "Bully someone with tickles!",
  aliases: [`tickles`],
  usage: "(@User)",
  execute(ayanami, message, args) {
    const Discord = require('discord.js');
    const { randomKey } = require('../settings/config.json');
    const Emote = require("../json/emojis.json");
    const bully = ayanami.emojis.cache.get(Emote.surebully);
    const Gifs = require("../json/gifs.json");
    const RandomOrg = require("random-org");
    const random = new RandomOrg({ apiKey: randomKey });

    const user = args.join(' ');

    random.generateIntegers({ min: 0, max: Gifs.tickle.length - 1, n: 1 })
      .then(function (r) {
        let imageURL = Gifs.tickle[r.random.data];
         ayanami.logger.info(`Generated number for tickle command: ${r.random.data}`);

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
          var description = `Tickle tickle tickle!!! ${bully} [Source](${imageURL})`
          sendEmbed();
        } else {
          var description = `<@${message.author.id}> Tickles **${user}** ${bully} [Source](${imageURL})`
          sendEmbed();
        }
      }).catch(err => {
         ayanami.logger.error(err)
        console.error(err)
        return message.reply('There was an error, please try again in a few minutes')
      })
  }
}