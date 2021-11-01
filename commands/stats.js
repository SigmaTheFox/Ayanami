const Discord = require("discord.js");

function secondsToHms(t) {
    t = Number(t);
    let d = Math.floor(t / 86400);
    let h = Math.floor((t % 86400) / 3600);
    let m = Math.floor(((t % 86400) % 3600) / 60);

    return `${("0" + d).slice(-2)}:${("0" + h).slice(-2)}:${("0" + m).slice(-2)}`
}

module.exports = {
    name: "stats",
    aliases: ["info", "stat"],
    category: "utility",
    description: "Get stats about the bot.",
    /**
     * @param {Discord.Client} ayanami 
     * @param {Discord.Message} message 
     * @param {String[]} args 
     */
    async execute(ayanami, message, args) {
        let guild = ayanami.guilds.cache.get("724873614104461322") || message.guild;
        let { heapTotal, heapUsed, rss } = process.memoryUsage()
        heapTotal = heapTotal / 1000000;
        heapUsed = heapUsed / 1000000;
        rss = rss / 1000000;

        let userCount = ayanami.users.cache.filter(u => !u.bot).size.toString(),
            commandCount = ayanami.commands.size.toString();

        let serverCreated = guild.createdAt.toString(),
            channelCount = guild.channels.cache.size.toString(),
            emoteCount = guild.emojis.cache.size.toString(),
            roleCount = guild.roles.cache.size.toString(),
            permaLink = "https://discord.gg/gXnaWhm"

        const embed = new Discord.MessageEmbed()
            .setDescription("Ayanami (綾波) is a multi-purpose bot created, hosted and maintained by Sigma specifically for this server. She has many features, including finding the source of an image.\nIn case you encounter problems, make sure to contact Sigma instead of wasting time googling for a support server.")
            .setThumbnail("https://cdn.discordapp.com/attachments/813773403562573875/813800677255020544/unknown.png")
            .setColor(45055)
            .addFields([
                { name: "•\u2000\Process Memory Usage", value: `${rss.toFixed(2)}MB`, inline: true },
                { name: "•\u2000\Heap Total", value: `${heapTotal.toFixed(2)}MB`, inline: true },
                { name: "•\u2000\Heap Used", value: `${heapUsed.toFixed(2)}MB`, inline: true },
                { name: "•\u2000\Bot Uptime", value: secondsToHms(process.uptime()), inline: true },
                { name: "•\u2000\Cached Users", value: userCount, inline: true },
                { name: "•\u2000\Commands", value: commandCount, inline: true },
                { name: "•\u2000\Server Channel Count", value: channelCount, inline: true },
                { name: "•\u2000\Server Emote Count", value: emoteCount, inline: true},
                { name: "•\u2000\Server Role Count", value: roleCount, inline: true },
                { name: "•\u2000\Server Creation Date", value: serverCreated, inline: true }
            ])
            .setFooter(`Permanent server invite link: ${permaLink}`)
        message.channel.send({ embeds: [embed] })
    }
}