const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "ban",
    args: true,
    category: "admin",
    description: "Hit someone with the ban hammer.",
    usage: "<@User or User ID> <reason>",
    async execute(ayanami, message, args) {
        if (message.channel.type !== "text") return message.reply("This command can't be used in DMs.")
        if (!message.member.hasPermission("BAN_MEMBERS")) return message.reply("You don't have permission to use this command.")

        let target = message.mentions.members.first() || await message.guild.members.fetch(args[0]);
        let reason = args.splice(1, args.length).join(" ") || "Unspecified";
        let channel = ayanami.channels.cache.get("783733205114421309");

        if (target.id === message.author.id) return message.channel.send("Why would you ban yourself?");
        if (target.id === message.guild.ownerID) return message.channel.send("You can't ban the server owner.");
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
            await target.user.send("You've been banned from Sigma's Den for reason: " + reason);
        } catch (err) {
            console.log(`${user.username || user.id || user} has the DMs blocked. Couldn't send ban message.`);
            ayanami.logger.log(`${user.username || user.id || user} has the DMs blocked. Couldn't send ban message.`);
        } finally {
            message.guild.members.ban(target, { reason: reason, days: 1 })
                .then(user => {
                    message.react("✅");
                    channel.send({ embed: embed });
                    ayanami.users.cache.delete(target.id);
                    ayanami.logger.log(`Banned user ${user.username || user.id || user}`);
                    console.log(`Banned user ${user.username || user.id || user}`);
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