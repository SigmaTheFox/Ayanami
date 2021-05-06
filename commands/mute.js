const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "mute",
    category: "admin",
    description: "Mute a user",
    args: true,
    usage: "<@User> <reason>",
    async execute(ayanami, message, args) {
        if (message.channel.type !== "text") return message.reply("This command can't be used in DMs.")
        if (!message.member.hasPermission("MANAGE_ROLES")) return message.reply("You don't have permission to use this command.")

        let target = message.mentions.members.first() || await message.guild.members.fetch(args[0]);
        let reason = args.splice(1, args.length).join(" ") || "Unspecified";
        let channel = ayanami.channels.cache.get("783733205114421309");
        let muteRole = message.guild.roles.cache.find(r => r.name === "Muted");

        let embed = new MessageEmbed()
            .setTitle("Muted")
            .setColor("#00FF")
            .setAuthor(target.user.tag, target.user.displayAvatarURL({ dynamic: true }))
            .addField("Reason", `**${reason}**`)
            .setTimestamp()

        if (target.id === message.author.id) return message.channel.send("Why would you Mute yourself?");
        if (target.id === message.guild.ownerID) return message.channel.send("You can't Mute the server owner.");
        if (target.id === ayanami.user.id) return message.channel.send("Commander... Please don't Mute me.");
        if (target.roles.highest.position >= message.member.roles.highest.position) return message.channel.send("This user has higher permissions than you.");
        if (target.roles.cache.find(r => r.name === "Muted")) return message.channel.send("This member is already Muted.");
        if (!muteRole) return message.channel.send("There is no `Muted` role in this server.");

        target.roles.add(muteRole, reason)
            .then(() => {
                message.react("✅");
                channel.send({ embed: embed });
                ayanami.logger.log(`Muted ${target.user.tag} - ${target.user.id}`)
                console.log(`Muted ${target.user.tag} - ${target.user.id}`);
            })
            .catch(e => {
                message.react("❎");
                ayanami.logger.error(e);
                console.error(e);
                return message.reply(`Failed to mute ${target.user.tag}`);
            })
    }
}