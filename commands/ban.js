const { MessageEmbed, Message, Client } = require('discord.js');
const logger = require("../modules/logger");

module.exports = {
    name: "ban",
    args: true,
    category: "admin",
    description: "Hit someone with the ban hammer.",
    usage: "<@User> <reason>",
    /**
     * 
     * @param {Client} ayanami 
     * @param {Message} message 
     * @param {*} args 
     * @returns 
     */
    execute(ayanami, message, args) {
        if (message.channel.type !== "text") return message.reply("Tis command can't be used in DMs.")
        if (!message.member.hasPermission("BAN_MEMBERS")) return message.reply("You don't have permission to use this command.")

        let target = message.mentions.members.first();
        let reason = args.splice(1, args.length).join(" ");
        let channel = ayanami.channels.cache.get("783733205114421309");

        let embed = new MessageEmbed()
            .setTitle("Ban")
            .setColor("#FF0000")
            .setAuthor(target.user.tag, target.user.displayAvatarURL({ dynamic: true }))
            .addField("Reason", `**${reason}**`)
            .setTimestamp()

        message.guild.members.ban(target, { reason: reason, days: 1 })
            .then(user => {
                channel.send({ embed: embed });
                ayanami.users.cache.delete(user.id || user);
                logger.log(`Banned user ${user.username || user.id || user}`);
                console.log(`Banned user ${user.username || user.id || user}`);
            })
            .catch(e => {
                logger.error(e);
                console.error(e);
                return message.reply(`Failed to ban user ${target.user.tag}`);
            })
    }
}