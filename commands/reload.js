module.exports = {
  name: `reload`,
  category: "admin",
  description: "**BOT OWNER ONLY** Reload a command.",
  args: true,
  usage: `<command name>`,
  execute(ayanami, message, args) {
    const config = require("../settings/config.json");

    if (message.author.id !== config.ownerID)
      return message.reply("You're not my owner!");
    if (!args || args.size < 1) return message.reply("Commander... You didn't tell me what to reload.");

    if (!ayanami.commands.has(args[0])) {
      return message.reply("This command does not exist.");
    }

    // The path is relative to the current folder.
    delete require.cache[require.resolve(`./${args[0]}.js`)];

    ayanami.commands.delete(args[0]);
    const props = require(`./${args[0]}.js`);
    ayanami.commands.set(args[0], props);
    message.reply(`I reloaded **${args[0]}** for you... Commander`);
  }
}