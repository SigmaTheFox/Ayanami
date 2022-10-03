const { Client, CommandInteraction, SlashCommandBuilder, EmbedBuilder } = require("discord.js");

let mod_role = "<@&724878371401760778>";

module.exports = {
    gloal: false,
    data: new SlashCommandBuilder()
        .setName("report")
        .setDescription("Report a user to the mods. Only mods can see it. Abuse will result in an insta-ban")
        .addSubcommand(cmd =>
            cmd.setName("dm")
                .setDescription("Report DM messages")
                .addUserOption(opt =>
                    opt.setName("user")
                        .setDescription("The offending user to report")
                        .setRequired(true))
                .addAttachmentOption(opt =>
                    opt.setName("screenshot")
                        .setDescription("A screenshot of the offending DM messages")
                        .setRequired(true)))
        .addSubcommand(cmd =>
            cmd.setName("channel")
                .setDescription("Report a message in a channel on the server")
                .addStringOption(opt =>
                    opt.setName("message")
                        .setDescription("The link of the message to report (right click message > Copy Message Link )")
                        .setRequired(true))),
    /**
     * @param {Client} ayanami
     * @param {CommandInteraction} interaction
     */
    async execute(ayanami, interaction) {
        let report_channel = ayanami.channels.cache.get("990429948445622272"),
            reporter = interaction.user;

        if (interaction.options.getSubcommand() === "dm") {
            let offender = interaction.options.getUser("user"),
                screenshot = interaction.options.getAttachment("screenshot").url;

            let embed = new EmbedBuilder()
                .setTimestamp()
                .setAuthor({ name: reporter.tag, iconURL: reporter.displayAvatarURL({ dynamic: true }) })
                .setTitle("DM report")
                .setDescription(`**${reporter.tag}** reported **${offender.tag} (${offender.id})** for sending inappropriate messages in DM *Check Screenshot*`)
                .setImage(screenshot)
                .setColor("Aqua");

            report_channel.send({ content: `${mod_role} there is a new report.`, embeds: [embed] });
            interaction.reply({ content: "Successfully sent the report", ephemeral: true });
        }
        else if (interaction.options.getSubcommand() === "channel") {
            let messageURL = interaction.options.getString("message");

            if (!/https?:\/\/(\w.*\.)?discord\.com\/channels\/[0-9].*\/[0-9].*\/[0-9].*\/?/gi.test(messageURL)) return interaction.reply({ content: "Please provide a valid message URL", ephemeral: true });

            let embed = new EmbedBuilder()
                .setTimestamp()
                .setAuthor({ name: reporter.tag, iconURL: reporter.displayAvatarURL({ dynamic: true }) })
                .setTitle("Channel report")
                .setDescription(`**${reporter.tag}** reported a message`)
                .addFields({ name: "Message URL", value: messageURL })
                .setColor("Blue");

            report_channel.send({ content: `${mod_role} there is a new report.`, embeds: [embed] })
            interaction.reply({ content: "Successfully sent the report", ephemeral: true });
        }

    }
}
