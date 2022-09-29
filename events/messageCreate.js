const config = require("../settings/config.json");
const { AyanamiCute, AyanamiThanks } = require("../settings/text.json");
const { Client, Message } = require("discord.js")
const { scamLinks } = require("../json/scamLinks.json")

/**
 * @param {Client} ayanami 
 * @param {Message} message 
 * @returns 
 */
module.exports = async (ayanami, message) => {
    // Scam link detection
    if (message.channel.type === "GUILD_TEXT") {
        if (/sigmathefox.com/gi.test(message.content)) return; // ignore my domain
        scamLinks.some(link => {
            let scamLinkRegex = new RegExp("https?://" + link, "gi")
            if (scamLinkRegex.test(message.content)) {
                message.channel.send(`${message.author.toString()} the URL you sent is blacklisted. To prevent scams your message has been deleted.`)
                message.delete()
            }
        })
    }

    // Checks if message was sent by a bot.
    if (message.author.bot) return;

    // auto-fxTwitter
    if (message.member?.roles?.cache.find(r => r.name === "fxtwitter") && message.channel.type === "GUILD_TEXT") {
        let twitterRegex = /https?:\/\/(mobile\.|www\.)?twitter.com\/\w+\/status\/\d+/gi,
            ignore = /<https?:\/\/(mobile\.|www\.)?twitter.com/gi;

        if (twitterRegex.test(message.content) && !ignore.test(message.content)) {
            let tweets = message.content.match(twitterRegex),
                args = message.content.split(/\s+/),
                text = args.filter(i => !/https?:\/\/(mobile\.|www\.)?twitter.com/gi.test(i)).join(" "),
                msgContent = `FX-ed **${message.author.tag}**'s twitter link(s)\n`;

            if (text || text.length > 0) msgContent += `Additional Text: *${text}*\n`;

            for (let tweet of tweets) {
                if (tweet.includes("fxtwitter.com") || tweet.includes("vxtwitter.com")) continue;
                msgContent += `\n${tweet.toLowerCase().replace("twitter", "fxtwitter")}`;
            }

            let msg = await message.channel.send(msgContent);
            message.delete();

            await msg.react("❌");
            let filter = (reaction, user) => reaction.emoji.name === "❌" && user.id === message.author.id;
            let collector = msg.createReactionCollector({ filter, time: 60000 });
            collector.on("collect", () => msg.delete());
            collector.on("end", () => {
                msg.reactions.removeAll().catch(() => { });
            })
        }
    }

    // Fetch channel if partial
    if (message.channel.partial) {
        try {
            await message.channel.commands.fetch()
        } catch (err) {
            ayanami.logger.error("Failed to fetch DM channel.");
            console.error("Failed to fetch DM channel");
        }
    }

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
