const Discord = require("discord.js");
const { freemem, totalmem } = require("os");

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
        let guild = ayanami.guilds.cache.get("724873614104461322");
        let { heapTotal, heapUsed, rss } = process.memoryUsage()
        heapTotal = heapTotal / 1000000;
        heapUsed = heapUsed / 1000000;
        rss = rss / 1000000;

        let usedMem = (totalmem() - freemem()) / 1000000000,
            totalMem = totalmem() / 1000000000

        let userCount = ayanami.users.cache.filter(u => !u.bot).size,
            commandCount = ayanami.commands.size;

        let serverCreated = guild.createdAt,
            channelCount = guild.channels.cache.size,
            emoteCount = guild.emojis.cache.size,
            roleCount = guild.roles.cache.size,
            permaLink = "https://discord.gg/gXnaWhm"

        const embed = new Discord.MessageEmbed()
            .setDescription("Ayanami (綾波) is a multi-purpose bot created, hosted and maintained by Sigma specifically for this server. She has many features, including finding the source of an image.\nIn case you encounter problems, make sure to contact Sigma instead of wasting time googling for a support server.")
            .setThumbnail("https://cdn.discordapp.com/attachments/813773403562573875/813800677255020544/unknown.png")
            .setColor(45055)
            .addFields([
                { name: "System Info", value: `•\u2000\System memory usage: ${usedMem.toFixed(2)}/${totalMem.toFixed(2)}GB\n•\u2000\Process memory Usage: ${rss.toFixed(2)}MB\n•\u2000\Heap Total: ${heapTotal.toFixed(2)}MB\n•\u2000\Heap Used: ${heapUsed.toFixed(2)}MB`, inline: true },
                { name: "Bot Info", value: `•\u2000\Uptime: ${secondsToHms(process.uptime())}\n•\u2000\Cached Users: ${userCount}\n•\u2000\Commands: ${commandCount}`, inline: true },
                { name: "Server info", value: `•\u2000\Creation date: ${serverCreated}\n•\u2000\Channel count: ${channelCount}\n•\u2000\Emotes count: ${emoteCount}\n•\u2000\Roles count: ${roleCount}` }
            ])
            .setFooter(`Permanent server invite link: ${permaLink}`)
        message.channel.send(embed)
    }
}