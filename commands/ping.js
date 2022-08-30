const { SlashCommandBuilder, CLient, CommandInteraction } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Pong!"),
    /**
     * @param {Client} ayanami
     * @param {CommandInteraction} interaction
     **/
    async execute(ayanami, interaction) {
        await interaction.reply({ content: "pong...", ephemeral: true, fetchReply: true })
            .then(m => {
                let ping = m.createdTimestamp - interaction.createdTimestamp;
                interaction.editReply(`Pong! My ping is: ${ping}, API Latency: ${Math.round(ayanami.ws.ping)}`)
            })
    }
}
