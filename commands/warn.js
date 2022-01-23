const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "warn",
    category: "admin",
    description: "Warn a user. This will send a message in the admin logs channel.",
    args: true,
    usage: "<@User or User ID> <reason>",
    async execute(ayanami, message, args) {
        if (message.channel.type !== "GUILD_TEXT") return message.reply("This command can't be used in DMs.")
        if (!message.member.permissions.has("KICK_MEMBERS")) return message.reply("You don't have permission to use this command.")

        let target = message.mentions.members.first() || await message.guild.members.cache.get(args[0]);
        let reason = args.splice(1, args.length).join(" ") || "Unspecified";
        let channel = ayanami.channels.cache.get("783733205114421309");

        let embed = new MessageEmbed()
            .setTitle("Warning")
            .setColor("#FFFF00")
            .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
            .addField("Member", `**${target.user.tag}** (${target.user.id})`)
            .addField("Reason", `**${reason}**`)
            .setTimestamp()

        try {
            await target.user.send(`You received a warning on Sigma's Den.\n Reason: **${reason}**`);
        } catch (err) {
            console.log(`${user.username || user.id || user.toString()} has the DMs blocked. Couldn't send warn message.`);
            ayanami.logger.log(`${user.username || user.id || user.toString()} has the DMs blocked. Couldn't send warn message.`);
        } finally {
            channel.send({ embeds: [embed] })
                .then(() => {
                    message.react("✅");
                    ayanami.logger.log(`Warned ${target.user.tag} - ${target.user.id}`);
                    console.log(`Warned ${target.user.tag} - ${target.user.id}`);
                })
                .catch(e => {
                    message.react("❎");
                    ayanami.logger.error(e);
                    console.error(e);
                })
        }
    }
}