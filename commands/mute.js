const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "mute",
    category: "admin",
    description: "Mute a user",
    args: true,
    usage: "<@User> <reason>",
    execute(ayanami, message, args) {
        if (message.channel.type !== "text") return message.reply("Tis command can't be used in DMs.")
        if (!message.member.hasPermission("MANAGE_ROLES")) return message.reply("You don't have permission to use this command.")

        let target = message.mentions.members.first();
        let reason = args.splice(1, args.length).join(" ");
        let channel = ayanami.channels.cache.get("783733205114421309");
        let muteRole = message.guild.roles.cache.find(r => r.name === "Muted");

        let embed = new MessageEmbed()
            .setTitle("Muted")
            .setColor("#00FF")
            .setAuthor(target.user.tag, target.user.displayAvatarURL({ dynamic: true }))
            .addField("Reason", `**${reason}**`)
            .setTimestamp()

        target.roles.add(muteRole, reason)
        channel.send({ embed: embed })
    }
}