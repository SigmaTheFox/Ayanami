const { MessageEmbed, Client, Message } = require('discord.js');

module.exports = {
    name: "mute",
    category: "admin",
    description: "Mute a user",
    args: true,
    usage: "<@User or User ID> <days> <reason>",
    /**
     * @param {Client} ayanami 
     * @param {Message} message 
     * @param {*} args 
     */
    async execute(ayanami, message, args) {
        if (message.channel.type !== "GUILD_TEXT") return message.reply("This command can't be used in DMs.")
        if (!message.member.permissions.has("MODERATE_MEMBERS")) return message.reply("You don't have permission to use this command.")

        let target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        let time = args[1] * 60 * 60 * 1000 * 24 || 7 * 60 * 60 * 1000 * 24;
        let reason = args.splice(2, args.length).join(" ") || "Unspecified";
        let channel = ayanami.channels.cache.get("783733205114421309");

        if (target.id === message.author.id) return message.channel.send("Why would you Mute yourself?");
        if (target.id === message.guild.ownerId) return message.channel.send("You can't Mute the server owner.");
        if (target.id === ayanami.user.id) return message.channel.send("Commander... Please don't Mute me.");
        if (target.roles.highest.position >= message.member.roles.highest.position) return message.channel.send("This user has higher permissions than you.");
        if (target.isCommunicationDisabled()) return message.channel.send("This member is already Muted.");

        let embed = new MessageEmbed()
            .setTitle("Muted")
            .setColor("#00FF")
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .addField("Member", `**${target.user.tag}** (${target.user.id})`)
            .addField("Time", `**${args[1]} Days**`)
            .addField("Reason", `**${reason}**`)
            .setTimestamp()

        try {
            await target.user.send(`You've been muted on Sigma's Den.\nTime: **${args[1]} Days**\nReason: **${reason}**`);
        } catch (err) {
            console.log(`${user.username || user.id || user.toString()} has the DMs blocked. Couldn't send mute message.`);
            ayanami.logger.log(`${user.username || user.id || user.toString()} has the DMs blocked. Couldn't send mute message.`);
        } finally {
            target.timeout(time, reason)
                .then(() => {
                    message.react("✅");
                    channel.send({ embeds: [embed] });
                    ayanami.logger.log(`Muted ${target.user.tag} - ${target.user.id} for ${args[1]} Days`)
                    console.log(`Muted ${target.user.tag} - ${target.user.id} for ${args[1]} Days`);
                })
                .catch(e => {
                    message.react("❎");
                    ayanami.logger.error(e);
                    console.error(e);
                    return message.reply(`Failed to mute ${target.user.tag}`);
                })
        }
    }
}