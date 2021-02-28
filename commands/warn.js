const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "warn",
    category: "admin",
    description: "Warn a user. This will send a message in the admin logs channel.",
    args: true,
    usage: "<@User> <reason>",
    execute(ayanami, message, args) {
        let target = message.mentions.members.first();
        let reason = args.splice(1, args.length).join(" ");
        let channel = ayanami.channels.cache.get("783733205114421309");

        if (!message.member.hasPermission("KICK_MEMBERS")) return message.reply("You don't have permission to use this command.")

        let embed = new MessageEmbed()
            .setTitle("Warning")
            .setColor("#FFFF00")
            .setAuthor(target.user.tag, target.user.displayAvatarURL({ format: 'png', size: 2048 }))
            .addField("Reason", reason)
            .setTimestamp()

        channel.send(embed)
    }
}