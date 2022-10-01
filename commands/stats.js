const { SlashCommandBuilder, EmbedBuilder, Client, CommandInteraction, Routes } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { clientID, guildID, token } = require("../settings/config.json");

function secondsToHms(t) {
    t = Number(t);
    let d = Math.floor(t / 86400),
        h = Math.floor((t % 86400) / 3600),
        m = Math.floor(((t % 8600) & 3600) / 60);

    return `${("0" + d).slice(-2)}:${("0" + h).slice(-2)}:${("0" + m).slice(-2)}`;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stats")
        .setDescription("Get server and bot stats"),
    /**
     * @param {Client} ayanami
     * @param {CommandInteraction} interaction
     */
    async execute(ayanami, interaction) {
        let guild = ayanami.guilds.cache.get("724873614104461322") || interaction.guild;
        let { heapTotal, heapUsed, rss } = process.memoryUsage()
        heapTotal = heapTotal / 1000000;
        heapUsed = heapUsed / 1000000;
        rss = rss / 1000000;
        let userCount = ayanami.users.cache.filter(u => !u.bot).size.toString(),
            rest = new REST({ version: "10" }).setToken(token),
            globalCommands = await rest.get(Routes.applicationCommands(clientID)),
            guildCommands = await rest.get(Routes.applicationGuildCommands(clientID, guildID)),
            totalCommands = `${globalCommands.length + guildCommands.length}`;

        let serverCreated = guild.createdAt.toString(),
            channelCount = guild.channels.cache.size.toString(),
            roleCount = guild.roles.cache.size.toString(),
            permaLink = "https://discord.gg/gXnaWhm"

        let embed = new EmbedBuilder()
            .setDescription("Ayanami (綾波) is a multi-purpose bot created, hosted and maintained by Sigma specifically for this server. She has many features, including finding the source of an image.\nIn case you encounter problems, make sure to contact Sigma instead of wasting time googling for a support server.")
            .setThumbnail("https://cdn.discordapp.com/attachments/813773403562573875/813800677255020544/unknown.png")
            .setColor(45055)
            .addFields([
                { name: "•\u2000\Process Memory Usage", value: `${rss.toFixed(2)}MB`, inline: true },
                { name: "•\u2000\Heap Total", value: `${heapTotal.toFixed(2)}MB`, inline: true },
                { name: "•\u2000\Heap Used", value: `${heapUsed.toFixed(2)}MB`, inline: true },
                { name: "•\u2000\Bot Uptime", value: secondsToHms(process.uptime()), inline: true },
                { name: "•\u2000\Cached Users", value: userCount, inline: true },
                { name: "•\u2000\Commands", value: totalCommands, inline: true },
                { name: "•\u2000\Server Channel Count", value: channelCount, inline: true },
                { name: "•\u2000\Server Role Count", value: roleCount, inline: true },
                { name: "•\u2000\Server Creation Date", value: serverCreated, inline: true }

            ])
            .setFooter({ text: `Permanent server invite link: ${permaLink}` });

        interaction.reply({ embeds: [embed] });
    }
}
