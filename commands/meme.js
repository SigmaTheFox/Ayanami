module.exports = {
  name: `meme`,
  category: "random",
  description: "Get a random meme from Reddit.",
  aliases: [`memes`],
  execute(ayanami, message, args) {
    const Discord = require('discord.js');
    const randomPuppy = require('random-puppy');
    let Reddits = [
      "dankmemes",
      "memes",
      "DeepFriedMemes",
      "MemeEconomy",
      "greentext",
      "2meirl4meirl"
    ]

    var SubReddit = Reddits[Math.floor(Math.random() * Reddits.length)];

    randomPuppy(SubReddit)
      .then(url => {
        const embed = new Discord.MessageEmbed()
          .setAuthor(ayanami.user.username, ayanami.user.displayAvatarURL({ format: 'png', size: 2048 }))
          .setDescription(`[Image URL](${url})`)
          .setImage(url)
          .setColor(45055)
          .setFooter(SubReddit, ayanami.user.displayAvatarURL({ format: 'png', size: 2048 }))
        return message.channel.send({
          embed
        });
      })
  }
}