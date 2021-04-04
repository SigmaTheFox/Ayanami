module.exports = {
  name: `lewd`,
  category: "random",
  description: "NOOO! This is too lewd!",
  execute(ayanami, message, args) {
    // Imports the emojis database file and gives them a name used to call them.
    const Gifs = require("../gifs.json");
    const Discord = require('discord.js');
    const Emote = require("../emojis.json");
    const { randomKey } = require('../settings/config.json');
    const lewd = ayanami.emojis.cache.get(Emote.vampirelewd);
    const RandomOrg = require("random-org");
    const random = new RandomOrg({ apiKey: randomKey });

    //let imageURL = Gifs.lewd[Math.floor(Math.random() * Gifs.lewd.length)];

    random.generateIntegers({ min: 0, max: Gifs.lewd.length - 1, n: 1 })
      .then(function (r) {
        let imageURL = Gifs.lewd[r.random.data];
         ayanami.logger.info(`Generated number for lewd command: ${r.random.data}`);
        // Sends the embed with the randomly generated image/gif.
        var embed = new Discord.MessageEmbed()
          .setAuthor(ayanami.user.username, ayanami.user.displayAvatarURL({ format: 'png', size: 2048 }))
          .setDescription(`NO!!! This is too lewd!!! ${lewd} [Source](${imageURL})`)
          .setImage(imageURL)
          .setColor(45055);
        return message.channel.send({ embed });
      }).catch(err => {
         ayanami.logger.error(err)
        console.error(err)
        return message.reply('There was an error, please try again in a few minutes')
      })
  }
}