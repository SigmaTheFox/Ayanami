const { MessageEmbed, Message, Client } = require('discord.js');

module.exports = {
    name: "unmute",
    args: true,
    category: "admin",
    description: "Unmute a user.",
    usage: "<@User or User ID>",
    async execute(ayanami, message, args) {
        if (message.channel.type !== "text") return message.reply("This command can't be used in DMs.")
        if (!message.member.hasPermission("MANAGE_ROLES")) return message.reply("You don't have permission to use this command.")

        let target = message.mentions.members.first() || await message.guild.members.fetch(args[0]);
        let channel = ayanami.channels.cache.get("783733205114421309");
        let muteRole = message.guild.roles.cache.find(r => r.name === "Muted");

        if (target.roles.highest.position >= message.member.roles.highest.position) return message.channel.send("This user has higher permissions than you.");
        if (!target.roles.cache.find(r => r.name === "Muted")) return message.channel.send("This user isn't muted.");
        if (!muteRole) return message.channel.send("There is no `Muted` role in this server.");

        let embed = new MessageEmbed()
            .setTitle("Unmuted")
            .setColor("#00FF00")
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .addField("Member", `**${target.user.tag}** (${target.user.id})`)
            .setDescription(`${target.user.username} has been unmuted.`)
            .setTimestamp()

        try {
            await target.user.send("You've been unmuted from Sigma's Den.");
        } catch (err) {
            console.log(`${user.username || user.id || user} has the DMs blocked. Couldn't send unmute message.`);
            ayanami.logger.log(`${user.username || user.id || user} has the DMs blocked. Couldn't send unmute message.`);
        } finally {
            target.roles.remove(muteRole)
                .then(() => {
                    message.react("✅");
                    channel.send({ embed: embed });
                    ayanami.logger.log(`Unmuted ${target.user.tag} - ${target.user.id}`);
                    console.log(`Unmuted ${target.user.tag} - ${target.user.id}`);
                })
                .catch(e => {
                    message.react("❎");
                    ayanami.logger.error(e);
                    console.error(e);
                    return message.reply(`Failed to unmute ${target.user.tag}`);
                })
        }
    }
}