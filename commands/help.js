const { Client, Message, MessageEmbed, Util } = require("discord.js");
const { prefix } = require("../settings/config.json");

/**
 * 
 * @param {*} client 
 * @param {GuildChannel} channel 
 */
function CommandList(client, channel) {
  let content = [];

  content.push("Here are all my commands, Commander:");
  content.push("```JSON\n" + client.commands.map(cmd => `${cmd.name}: ${cmd.description}`).join("\n") + "```");
  content.push(`To get further information about a command, you can use \`${prefix}help [command name]!\``);

  let contentArray = Util.splitMessage(content.join(""), { append: "```", prepend: "```JSON\n" })
  contentArray.forEach(msg => {
    channel.send({ content: msg })
  })
}

module.exports = {
  name: `help`,
  aliases: [`commands`],
  category: "utility",
  description: "This command",
  usage: "[command name]",
  /**
   * @param {Client} ayanami 
   * @param {Message} message 
   * @param {String[]} args 
   */
  execute(ayanami, message, args) {
    if (args.length) { // Send command specific help
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

      return message.reply({ embeds: [embed] })
    }

    return CommandList(ayanami, message.channel);
  }
}