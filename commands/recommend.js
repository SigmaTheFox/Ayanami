const { SlashCommandBuilder, Client, CommandInteraction, EmbedBuilder } = require("discord.js");

let channel, member, embed, anonymity, type, recommendation, attachment, roleCheck,
    typeTitle = {
        "s": "Server Recommendation",
        "r": "Render Recommendation"
    }

module.exports = {
    data: new SlashCommandBuilder()
        .setName("recommend")
        .setDescription("Recommend a change to the server or a new render")
        .addStringOption(opt =>
            opt.setName("type")
                .setDescription("The recommendation type")
                .setRequired(true)
                .addChoices(
                    { name: "server", value: "s" },
                    { name: "render", value: "r" }
                ))
        .addStringOption(opt =>
            opt.setName("anonymity")
                .setDescription("Wether you want your name to be visible or remain anonymous")
                .setRequired(true)
                .addChoices(
                    { name: "visible", value: "v" },
                    { name: "anonymous", value: "a" }
                ))
        .addStringOption(opt =>
            opt.setName("recommendation")
                .setDescription("Your recommendation")
                .setRequired(true))
        .addAttachmentOption(opt =>
            opt.setName("attachment")
                .setDescription("An example attachment if needed")),
    /**
     * @param {Client} ayanami
     * @param {CommandInteraction} interaction
     */
    async execute(ayanami, interaction) {
        member = ayanami.guilds.cache.get("724873614104461322").members.cache.get(interaction.user.id);
        roleCheck = member.roles.cache;
        type = interaction.options.getString("type");
        anonymity = interaction.options.getString("anonymity");
        recommendation = interaction.options.getString("recommendation");
        attachment = interaction.options.getAttachment("attachment");
        embed = new EmbedBuilder()
            .setTitle(typeTitle[type])
            .setColor(45055);

        if (type === "s") channel = ayanami.channels.cache.get("724916543250497617");
        else if (type === "r") channel = ayanami.channels.cache.get("779289003504566273");

        if (anonymity === "v") embed.setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.displayAvatarURL({ dynamic: true })
        });
        else if (anonymity === "a") embed.setAuthor({
            name: interaction.user.username,
            iconURL: "https://cdn.discordapp.com/attachments/340814937435668480/783290091313037332/question-mark-768x768.png"
        });

        embed.setDescription(recommendation);
        if (attachment) embed.setImage(attachment.url);

        let msg = await channel.send({ embeds: [embed] });
        if (type === "r") {
            await msg.react("✅");
            await msg.react("❎");
        }
        interaction.reply({ content: "Successfully posted recommendation", ephemeral: true });
    }
}
