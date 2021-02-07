module.exports = {
  name: `pat`,
  aliases: [`pats`, `headpat`, `patpat`],
  execute(ayanami, message, args) {
    const Discord = require('discord.js');
    const Gifs = require("../gifs.json");
    const { randomKey } = require('../settings/config.json');
    const Emote = require("../emojis.json");
    const patpat = ayanami.emojis.cache.get(Emote.dvapatpat);
    const RandomOrg = require("random-org");
    const logs = require('../modules/logger');
    const random = new RandomOrg({ apiKey: randomKey });

    //let imageURL = Gifs.pat[Math.floor(Math.random() * Gifs.pat.length)];
    const user = `**${args.join(' ')}**` || `<@${message.mentions.users.first().id}>`;

    random.generateIntegers({ min: 0, max: Gifs.pat.length - 1, n: 1 })
      .then(function (r) {
        let imageURL = Gifs.pat[r.random.data];
        logs.info(`Generated number for pat command: ${r.random.data}`);

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
          var description = `Pat pat pat ${patpat} [Source](${imageURL})`
          sendEmbed();
        } else {
          var description = `<@${message.author.id}> Pats ${user} ${patpat} [Source](${imageURL})`
          sendEmbed();
        }
      }).catch(err => {
        logs.error(err)
        console.error(err)
        return message.reply('There was an error, please try again in a few minutes')
      })
  }
}