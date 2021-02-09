const { Client, Message, MessageEmbed } = require("discord.js");
const logger = require("../modules/logger");

module.exports = {
  name: `help`,
  aliases: [`commands`],
  category: "utility",
  description: "This command",
  /**
   * @param {Client} ayanami 
   * @param {Message} message 
   * @param {String[]} args 
   */
  execute(ayanami, message, args) {
    let embeds = {}, counts = {};

    try {
      ayanami.commands.forEach(cmd => {
        if (!embeds[cmd.category]) {
          embeds[cmd.category] = []
          counts[cmd.category] = 0
        }
        if (!embeds[cmd.category][Math.floor(counts[cmd.category] / 25)]) {
          embeds[cmd.category].push(new MessageEmbed()
            .setTitle(`${cmd.category.toUpperCase()} ${Math.floor(counts[cmd.category] / 25) == 0 ? "" : Math.floor(counts[cmd.category] / 25) + 1}`)
            .setAuthor(ayanami.user.username, ayanami.user.displayAvatarURL())
            .setColor(45055)
          )
        }
        embeds[cmd.category][Math.floor(counts[cmd.category] / 25)].addField(cmd.name, cmd.description ? cmd.description : "\u200b", true)
        counts[cmd.category]++
      })

      if (message.channel.type !== "dm") message.channel.send("Ok Commander. Check your DMs.\n*In case you're not getting anything... Check if you have DMs allowed in the server privacy settings*")
      for (const key of Object.keys(embeds)) {
        embeds[key].forEach(e => {
          message.author.send(e)
          .catch(() => { return })
        })
      }
    } catch (error) {
      message.channel.send("There was an error.");
      console.error(error);
      return logger.error(error);
    }
  }
};
