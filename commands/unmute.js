const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "unmute",
    args: true,
    category: "admin",
    description: "Unmute a user.",
    usage: "<@User>",
    execute(ayanami, message, args) {
        if (message.channel.type !== "text") return message.reply("Tis command can't be used in DMs.")
        if (!message.member.hasPermission("MANAGE_ROLES")) return message.reply("You don't have permission to use this command.")

        let target = message.mentions.members.first();
        let channel = ayanami.channels.cache.get("783733205114421309");
        let muteRole = message.guild.roles.cache.find(r => r.name === "Muted");

        let embed = new MessageEmbed()
            .setTitle("Unmuted")
            .setColor("#00FF00")
            .setAuthor(target.user.tag, target.user.displayAvatarURL({ dynamic: true }))
            .setDescription(`${target.user.username} has been unmuted.`)
            .setTimestamp()

        target.roles.remove(muteRole)
        channel.send({ embed: embed })
    }
}