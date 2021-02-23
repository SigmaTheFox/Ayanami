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
    category: "utility",
    description: "Get stats about the bot.",
    /**
     * 
     * @param {Discord.Client} ayanami 
     * @param {Discord.Message} message 
     * @param {String[]} args 
     */
    async execute(ayanami, message, args) {
        let { heapTotal, heapUsed, rss } = process.memoryUsage()
        heapTotal = heapTotal / 1000000;
        heapUsed = heapUsed / 1000000;
        rss = rss / 1000000;

        let usedMem = (totalmem() - freemem()) / 1000000000,
            totalMem = totalmem() / 1000000000

        let userCount = ayanami.users.cache.filter(u => !u.bot).size,
            commandCount = ayanami.commands.size

        const embed = new Discord.MessageEmbed()
            .setAuthor(ayanami.user.username, ayanami.user.displayAvatarURL(true))
            .setTitle("Ayanami Stats")
            .setColor(45055)
            .addFields([
                { name: "System Info", value: `•\u2000\**System memory usage**: ${usedMem.toFixed(2)}/${totalMem.toFixed(2)}GB\n•\u2000\**Process memory Usage**: ${rss.toFixed(2)}MB\n•\u2000\**Heap Total**: ${heapTotal.toFixed(2)}MB\n•\u2000\**Heap Used**: ${heapUsed.toFixed(2)}MB`, inline: true },
                { name: "Bot Info", value: `•\u2000\**Uptime**: ${secondsToHms(process.uptime())}\n•\u2000\**Cached Users**: ${userCount}\n•\u2000\**Commands**: ${commandCount}`, inline: true }
            ])
            .setFooter("Created and Maintained by SigmaTheFox")
        message.channel.send(embed)
    }
}