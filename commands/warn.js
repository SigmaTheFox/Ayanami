const { MessageEmbed } = require('discord.js');
const logger = require("../modules/logger");

module.exports = {
    name: "warn",
    category: "admin",
    description: "Warn a user. This will send a message in the admin logs channel.",
    args: true,
    usage: "<@User> <reason>",
    execute(ayanami, message, args) {
        if (message.channel.type !== "text") return message.reply("Tis command can't be used in DMs.")
        if (!message.member.hasPermission("KICK_MEMBERS")) return message.reply("You don't have permission to use this command.")

        let target = message.mentions.members.first();
        let reason = args.splice(1, args.length).join(" ");
        let channel = ayanami.channels.cache.get("783733205114421309");

        let embed = new MessageEmbed()
            .setTitle("Warning")
            .setColor("#FFFF00")
            .setAuthor(target.user.tag, target.user.displayAvatarURL({ dynamic: true }))
            .addField("Reason", `**${reason}**`)
            .setTimestamp()

        channel.send({ embed: embed })
            .then(() => {
                message.react("✅");
                logger.log(`Warned ${target.user.tag} - ${target.user.id}`);
                console.log(`Warned ${target.user.tag} - ${target.user.id}`);
            })
            .catch(e => {
                message.react("❎");
                logger.error(e);
                console.error(e);
            })
    }
}