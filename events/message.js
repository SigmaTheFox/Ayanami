const config = require("../settings/config.json");
const { AyanamiCute, AyanamiThanks } = require("../settings/text.json");

module.exports = async (ayanami, message) => {
    // Checks if message was sent by a bot.
    if (message.author.bot) return;

    
    // Responds when saying "Thanks ayanami"
    if ((/(^|\s)THANKS?(\s|$)/gi).test(message.content)
        && /(^|\s)AYANAMI(\s|$)/gi.test(message.content)) {
        message.channel.send(AyanamiThanks);
    }
    // Responds when saying that ayanami is cute
    if (/(^|\s)AYANAMI(\s|$)/gi.test(message.content)
        && /(^|\s)CUTE(\s|$)/gi.test(message.content)) {
        message.channel.send(AyanamiCute);
    }


    // Checks if the command starts with the prefix.
    if (!message.content.startsWith(config.prefix)) return;

    // Gets rid of the need of adding the prefix to startsWith().
    const args = message.content.slice(config.prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    // Gets the command names and aliases.
    const command = ayanami.commands.get(commandName)
        || ayanami.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    // Returns if there is no command with that name.
    if (!command) return message.reply(`There is no command called **${commandName}**. Make sure you typed the command correctly or ask Commander Sigma if he can add it.`);

    // Checks for arguments for the command.
    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        // If the command has a usage value it'll tell the user how to use it properly.
        if (command.usage) {
            reply += `\nThe proper usage would be: \`${config.prefix}${command.name} ${command.usage}\``;
        }
        return message.channel.send(reply);
    }

    // Check if the command is active or not
    if (command.locked) {
        let reply = `This command isn't currently active, ${message.author}.`

        if (command.event) {
            reply += `\nIt will be active on ${command.event}.`
        }
        return message.channel.send(reply)
    }

    // This will execute the command and if there was an error it'll tell the user.
    try {
        command.execute(ayanami, message, args);
        console.log(`[${message.author.id} - ${message.author.tag}] used command: "${command.name}"`);
        ayanami.logger.info(`[${message.author.id} - ${message.author.tag}] used command: "${command.name}"`);
    } catch (err) {
        ayanami.logger.error(err);
        message.reply('There was an error trying to execute that command!');
    }
}