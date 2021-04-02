const { MessageEmbed } = require('discord.js');
const logger = require("../modules/logger");

module.exports = {
    name: "ban",
    args: true,
    category: "admin",
    description: "Hit someone with the ban hammer.",
    usage: "<@User> <reason>",
    execute(ayanami, message, args) {
        if (!message.member.hasPermission("BAN_MEMBERS")) return message.reply("You don't have permission to use this command.")

        let target = message.mentions.members.first();
        let reason = args.splice(1, args.length).join(" ");
        let channel = ayanami.channels.cache.get("783733205114421309");

        let embed = new MessageEmbed()
            .setTitle("Ban")
            .setColor("#FF0000")
            .setAuthor(target.user.tag, target.user.displayAvatarURL({ format: 'png', size: 2048 }))
            .addField("Reason", `**${reason}**`)
            .setTimestamp()

        message.guild.members.ban(target, { reason: reason })
            .then(ayanami.users.cache.delete(target.id))
            .catch(e => {
                logger.error(e);
                console.error(e);
                return message.reply(`Failed to ban user ${target.user.tag}`);
            })
        channel.send(embed)
    }
}