const config = require("../settings/config.json");

module.exports = {
  name: `reload`,
  category: "admin",
  description: "**BOT OWNER ONLY** Reload a command.",
  args: true,
  usage: `<reload/load/unload> <command name>`,
  execute(ayanami, message, args) {
    if (message.author.id !== config.ownerID) return message.reply("You're not my owner!");

    if (/\bl(oad)?\b/gi.test(args[0])) {
      if (!args[1]) return message.reply("Commander... Please specify a command to load.");
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
      if (!args[1]) return message.reply("Commander... Please specify a command to reload.")
      if (!ayanami.commands.has(args[1])) return message.reply("This command does not exist.");

      delete require.cache[require.resolve(`./${args[1]}.js`)];

      ayanami.commands.delete(args[1]);
      let props = require(`./${args[1]}.js`);
      ayanami.commands.set(args[1], props);
      message.reply(`I reloaded **${args[1]}** for you... Commander`);
    }
    else if (/\bu(nload)?\b/gi.test(args[0])) {
      if (!args[1]) return message.reply("Commander... Please specify a command to unload.")
      if (!ayanami.commands.has(args[1])) return message.reply("This command does not exist.");

      delete require.cache[require.resolve(`./${args[1]}.js`)];
      ayanami.commands.delete(args[1]);
      message.reply(`I unloaded **${args[1]}** for you... Commander`);
    }
  }
}