const { Client, Message, MessageEmbed } = require("discord.js");
const { prefix } = require("../settings/config.json");


module.exports = {
  name: `help`,
  aliases: [`commands`],
  category: "utility",
  description: "This command",
  usage: "(command name)",
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

      if (args.length) {
        let commandName = args[0].toLowerCase(),
          cmd = ayanami.commands.get(commandName)
            || ayanami.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!cmd) return message.reply(`There is no command called **${commandName}**.`);

        let embed = new MessageEmbed()
          .setTitle(`${cmd.name.toUpperCase()} HELP`)
          .setAuthor(ayanami.user.username, ayanami.user.displayAvatarURL())
          .setColor(45055)
        if (cmd.aliases) embed.addField("Aliases", cmd.aliases.join(", "));
        if (cmd.description) embed.addField("Description", cmd.description);
        if (cmd.usage) embed.addField("Usage", `${prefix}${cmd.name} ${cmd.usage}`)

        if (message.channel.type !== "dm") message.channel.send("Ok Commander. Check your DMs.")
        return message.author.send(embed).catch(() => message.reply("Your DMs seem to be blocked."))
      }

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
      return  ayanami.logger.error(error);
    }
  }
};
