const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "recommend",
    category: "utility",
    description: "Recommend a change to the server or a new render. Use `-help` as type to get further help.",
    aliases: ["suggest"],
    args: true,
    usage: "-<type of recommendation> -<anonymosity> <recommendation>\nUse //recommend -help for further instructions.",
    async execute(ayanami, message, args) {
        var channel;
        var embed;
        var roleCheck = ayanami.guilds.cache.get("724873614104461322").members.cache.get(message.author.id).roles.cache

        if (!args[0].toLowerCase().includes("-")) return message.reply("Please use `//recommend -help` to get help on how to use the command.");

        // Check first argument
        switch (args[0].toLowerCase()) {
            case "-help":
            case "-h":
                var help = new MessageEmbed()
                    .setTitle("Recommend guide")
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ format: 'png', size: 2048 }))
                    .setColor(45055)
                    .addFields(
                        { name: "Types", value: "-help: The list you're looking at now.\n-server: Recommend server changes.\n-render: Recommend renders." },
                        { name: "Anonymosity", value: "-user: Show your username in the recommendation.\n-anon: Send the recommendation as anonymous." },
                        { name: "Example", value: "//recommend -server -user Add this emote to the server." }
                    )
                return message.author.send({ embed: help })
                .catch(() => {return message.channel.send("Your DMs seem to be blocked, make sure you allow them in the server privacy settings")})
                break;
            case "-server":
            case "-s":
                channel = ayanami.channels.cache.get("724916543250497617");
                embed = new MessageEmbed()
                    .setTitle("Server Recommendation")
                    .setColor(45055)
                break;
            case "-render":
            case "-r":
                if (!roleCheck.find(r => r.name === "NSFW")) return message.author.send("You need the NSFW role to recommend renders.")
                .catch(() => {return message.channel.send("Your DMs seem to be blocked, make sure you allow them in the server privacy settings")})
                channel = ayanami.channels.cache.get("779289003504566273");
                embed = new MessageEmbed()
                    .setTitle("Render Recommendation")
                    .setColor(45055)
                break;
        }

        switch (args[1].toLowerCase()) {
            case "-user":
            case "-u":
                embed = embed
                    .setAuthor(message.author.username, message.author.displayAvatarURL({ format: 'png', size: 2048 }))
                break;
            case "-anon":
            case "-a":
                embed = embed
                    .setAuthor("Anonymous", "https://cdn.discordapp.com/attachments/340814937435668480/783290091313037332/question-mark-768x768.png")
                break;
        }

        args = args.splice(2, args.length).join(" ")
        embed = embed.setDescription(args);

        if (!args) return message.reply("Please write a suggestion.")
        if (message.attachments.size >= 1) embed = embed.setImage(message.attachments.first().url);
        channel.send(embed)

    }
}