const config = require("../settings/config.json");

module.exports = {
  name: `reload`,
  category: "admin",
  description: "**BOT OWNER ONLY** Reload a command.",
  args: true,
  usage: `<reload/load> <command name>`,
  execute(ayanami, message, args) {
    if (message.author.id !== config.ownerID)
      return message.reply("You're not my owner!");
    if (!args || args.size < 1) return message.reply("Commander... You didn't tell me what to reload.");

    if (/\bl(oad)?\b/gi.test(args[0])) {
      if (ayanami.commands.has(args[1])) return message.reply("This command is already loaded.");
      try {
        let props = require(`./${args[1]}.js`);
        ayanami.commands.set(args[1], props);
        message.reply(`I loaded **${args[1]}** for you... Commander`);
      } catch (err) {
        return message.reply(`Couldn't find a command called **${args[1]}**.`)
      }
    }
    else if (/\br(eload)?\b/gi.test(args[0])) {
      if (!ayanami.commands.has(args[1])) return message.reply("This command does not exist.");
  
      // The path is relative to the current folder.
      delete require.cache[require.resolve(`./${args[1]}.js`)];
  
      ayanami.commands.delete(args[1]);
      let props = require(`./${args[1]}.js`);
      ayanami.commands.set(args[1], props);
      message.reply(`I reloaded **${args[1]}** for you... Commander`);
    }
  }
}