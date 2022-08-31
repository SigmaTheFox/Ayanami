const { SlashCommandBuilder, CLient, CommandInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("Get someone else's or your own profile picture")
        .addSubcommand(cmd =>
            cmd
                .setName("user")
                .setDescription("Get the user's profile picture")
                .addUserOption(opt => opt.setName("user").setDescription("The user").setRequired(false)))
        .addSubcommand(cmd =>
            cmd
                .setName("server")
                .setDescription("Get the user's server profile picture")
                .addUserOption(opt => opt.setName("user").setDescription("The user").setRequired(false))),
    /**
     * @param {Client} ayanami
     * @param {CommandInteraction} interaction
     */
    async execute(ayanami, interaction) {
        const target = interaction.options.getMember("user") || interaction.member;

        if (interaction.options.getSubcommand() === "user") {
            await interaction.reply(target.user.displayAvatarURL({ format: "png", dynamic: true, size: 4096 }));
        }
        else if (interaction.options.getSubcommand() === "server") {
            await interaction.reply(target.displayAvatarURL({ format: "png", dynamic: true, size: 4096 }));
        }
    }
}
