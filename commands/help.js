const { Client, Message, MessageEmbed } = require("discord.js");
const { prefix } = require("../settings/config.json");
const { Menu } = require("discord.js-menu");

function sortCommands(client, author) {
  let embeds = {}, fieldCounts = {}, embedCount = -1;
  
  client.commands.forEach(cmd => {
    if (!embeds[cmd.category]) { // Create the category in the embeds and counts objects
      embeds[cmd.category] = []
      fieldCounts[cmd.category] = 0
    } // If a category's embed has more than 25 fields, create a new embed
    if (!embeds[cmd.category][Math.floor(fieldCounts[cmd.category] / 25)]) {
      embeds[cmd.category].push(new MessageEmbed()
        .setTitle(`${cmd.category.toUpperCase()} ${Math.floor(fieldCounts[cmd.category] / 25) == 0 ? "" : Math.floor(fieldCounts[cmd.category] / 25) + 1}`)
        .setAuthor(author.username, author.displayAvatarURL())
        .setColor(45055)
      )
      embedCount++
    } // Otherwise add more fields and increase the field count for that category
    embeds[cmd.category][Math.floor(fieldCounts[cmd.category] / 25)].addField(cmd.name, cmd.description ? cmd.description : "\u200b", true)
    fieldCounts[cmd.category]++
  })
  return {
    embeds, embedCount
  }
}

function createMenuPagesArray(embeds, embedCount) {
  let menuPages = [], name = 0;
  // Loop through all categories
  for (let key of Object.keys(embeds)) {
    // Loop through all embeds in the category
    embeds[key].forEach(content => {
      // Add the embed to the help menu array
      switch (name) {
        case 0:
          menuPages.push({
            name, content,
            reactions: { "❎": "delete", "➡️": "next" }
          })
          name++
          break;
        case embedCount:
          menuPages.push({
            name, content,
            reactions: { "❎": "delete", "⬅️": "previous" }
          })
          break;
        default:
          menuPages.push({
            name, content,
            reactions: { "❎": "delete", "⬅️": "previous", "➡️": "next" }
          })
          name++
          break;
      }
    })
  }
  return menuPages
}

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

      return message.author.send({ embed })
      .then(() => { if (message.channel.type !== "dm") message.channel.send("Ok Commander. Check your DMs.") })
      .catch(message.reply("Your DMs seem to be blocked."))
    }

    let { embeds, embedCount } = sortCommands(ayanami, message.author)
    let helpMenu = new Menu(message.channel, message.author.id, createMenuPagesArray(embeds, embedCount), 300000)
    helpMenu.start()
  }
}