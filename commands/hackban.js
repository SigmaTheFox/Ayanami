const { MessageEmbed, Message } = require('discord.js');

module.exports = {
    name: "hackban",
    args: true,
    aliases: ["forceban"],
    category: "admin",
    description: "Ban a user who isn't on the server.",
    usage: "<User ID> <reason>",
    /**
     * 
     * @param {*} ayanami 
     * @param {Message} message 
     * @param {*} args 
     * @returns 
     */
    async execute(ayanami, message, args) {
        if (message.channel.type !== "GUILD_TEXT") return message.reply("This command can't be used in DMs.")
        if (!message.member.permissions.has("BAN_MEMBERS")) return message.reply("You don't have permission to use this command.")

        let target = args[0];
        let reason = args.splice(1, args.length).join(" ") || "Unspecified";
        let channel = ayanami.channels.cache.get("783733205114421309");

        if (target === message.author.id) return message.channel.send("Why would you ban yourself?");
        if (target === message.guild.ownerId) return message.channel.send("You can't ban the server owner.");
        if (target === ayanami.user.id) return message.channel.send("Commander... Please don't ban me.");

        let embed = new MessageEmbed()
            .setTitle("Ban")
            .setColor("#FF0000")
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .addField("Member", `**${target}**`)
            .addField("Reason", `**${reason}**`)
            .setTimestamp()


        message.guild.members.ban(target, { reason: reason, days: 1 })
            .then(user => {
                message.react("✅");
                channel.send({ embeds: [embed] });
                ayanami.users.cache.delete(target);
                ayanami.logger.log(`Banned user with ID ${target}`);
                console.log(`Banned user with ID ${target}`);
            })
            .catch(e => {
                message.react("❎");
                ayanami.logger.error(e);
                console.error(e);
                return message.reply(`Failed to ban user with ID ${target}`);
            })
    }
}