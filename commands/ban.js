const { MessageEmbed, Message, Client } = require('discord.js');

module.exports = {
    name: "ban",
    args: true,
    category: "admin",
    description: "Hit someone with the ban hammer.",
    usage: "<@User or User ID> <reason>",
    /**
     * 
     * @param {Client} ayanami 
     * @param {Message} message 
     * @param {*} args 
     * @returns 
     */
    async execute(ayanami, message, args) {
        if (message.channel.type !== "GUILD_TEXT") return message.reply("This command can't be used in DMs.")
        if (!message.member.permissions.has("BAN_MEMBERS")) return message.reply("You don't have permission to use this command.")

        let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let reason = args.splice(1, args.length).join(" ") || "Unspecified";
        let channel = ayanami.channels.cache.get("783733205114421309");

        if (target.id === message.author.id) return message.channel.send("Why would you ban yourself?");
        if (target.id === message.guild.ownerId) return message.channel.send("You can't ban the server owner.");
        if (target.id === ayanami.user.id) return message.channel.send("Commander... Please don't ban me.");
        if (target.roles.highest.position >= message.member.roles.highest.position) return message.channel.send("This user has higher permissions than you.");

        let embed = new MessageEmbed()
            .setTitle("Ban")
            .setColor("#FF0000")
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .addField("Member", `**${target.user.tag}** (${target.user.id})`)
            .addField("Reason", `**${reason}**`)
            .setTimestamp()

        try {
            await target.user.send(`You have been banned from Sigma's Den.\nReason: **${reason}**`);
        } catch (err) {
            console.log(`${user.username || user.id || user} has the DMs blocked. Couldn't send ban message.`);
            ayanami.logger.log(`${user.username || user.id || user} has the DMs blocked. Couldn't send ban message.`);
        } finally {
            message.guild.members.ban(target.user.id, { reason: reason, days: 1 })
                .then(user => {
                    message.react("✅");
                    channel.send({ embeds: [embed] });
                    ayanami.users.cache.delete(target.user.id);
                    ayanami.logger.log(`Banned user ${user.username || user.id || user.toString()}`);
                    console.log(`Banned user ${user.username || user.id || user.toString()}`);
                })
                .catch(e => {
                    message.react("❎");
                    ayanami.logger.error(e);
                    console.error(e);
                    return message.reply(`Failed to ban user ${target.user.tag}`);
                })
        }
    }
}