const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "mute",
    category: "admin",
    description: "Mute a user",
    args: true,
    usage: "<@User> <reason>",
    execute(ayanami, message, args) {
        let target = message.mentions.members.first();
        let reason = args.splice(1, args.length).join(" ");
        let channel = ayanami.channels.cache.get("783733205114421309");
        let muteRole = message.guild.roles.cache.find(r => r.name === "Muted");

        if (!message.member.hasPermission("MANAGE_ROLES")) return message.reply("You don't have permission to use this command.")

        let embed = new MessageEmbed()
            .setTitle("Muted")
            .setColor("#00FF")
            .setAuthor(target.user.tag, target.user.displayAvatarURL({ format: 'png', size: 2048 }))
            .addField("Reason", reason)
            .setTimestamp()

        target.roles.add(muteRole, reason)
        channel.send(embed)
    }
}