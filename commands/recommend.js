const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "recommend",
    category: "utility",
    description: "Recommend a change to the server or a new render. Use `-help` as type to get further help.",
    aliases: ["suggest"],
    args: true,
    usage: "-<type of recommendation> -<anonymosity> <recommendation>",
    async execute(ayanami, message, args) {
        let channel, embed,
            member = await ayanami.guilds.cache.get("724873614104461322").members.fetch(message.author.id),
            roleCheck = member.roles.cache;

        if (roleCheck.find(r => r.name === "Muted")) return message.channel.send("You seem to be muted on the server. To prevent abuse, Muted users can't use this command.");
        if (!args[0].toLowerCase().includes("-")) return message.reply("Please use `//recommend -help` to get help on how to use the command.");

        switch (args[0].toLowerCase()) {
            case "-help":
            case "-h":
                let help = new MessageEmbed()
                    .setTitle("Recommend guide")
                    .setAuthor(ayanami.user.username, ayanami.user.displayAvatarURL({ dynamic: true }))
                    .setColor(45055)
                    .addFields(
                        { name: "Types", value: "-help: The list you're looking at now.\n-server: Recommend server changes.\n-render: Recommend renders." },
                        { name: "Anonymosity", value: "-user: Show your username in the recommendation.\n-anon: Send the recommendation as anonymous." },
                        { name: "Example", value: "//recommend -server -user Add this emote to the server." }
                    )
                return message.channel.send({ embed: help });
            case "-server":
            case "-s":
                channel = ayanami.channels.cache.get("724916543250497617");
                embed = new MessageEmbed()
                    .setTitle("Server Recommendation")
                    .setColor(45055)
                break;
            case "-render":
            case "-r":
                if (!roleCheck.find(r => r.name === "NSFW")) return message.channel.send("You need the NSFW role to recommend renders.");
                channel = ayanami.channels.cache.get("779289003504566273");
                embed = new MessageEmbed()
                    .setTitle("Render Recommendation")
                    .setColor(45055)
                break;
            default:
                return message.channel.send(`${args[0]} isn't a valid recommendation type. Use //recommend -help for an example.`);
        }

        switch (args[1].toLowerCase()) {
            case "-user":
            case "-u":
                embed.setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }));
                break;
            case "-anon":
            case "-a":
                embed.setAuthor("Anonymous", "https://cdn.discordapp.com/attachments/340814937435668480/783290091313037332/question-mark-768x768.png");
                break;
            default:
                return message.channel.send(`${args[1]} isn't a valid anonymosity type. Use //recommend -help for an example.`);
        }
        suggestion = args.splice(2, args.length).join(" ")
        embed.setDescription(suggestion);

        if (!suggestion) return message.reply("Please write a suggestion.");
        if (message.attachments.size >= 1) embed.setImage(message.attachments.first().url);

        try {
            let msg = await channel.send({ embed: embed });
            if (args[0] === "-render" || args[0] === "-r") {
                await msg.react("✅");
                await msg.react("❎");
            }
            if (message.channel.type === "text") return message.delete();
            else return message.react("👍");
        } catch (err) {
            console.error(err);
        }
    }
}