const { Client, Interaction } = require("discord.js");

/**
 * @param {Client} ayanami
 * @param {Interaction} interaction
 */
module.exports = async (ayanami, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(ayanami, interaction);
    } catch (e) {
        ayanami.logger.error(e);
        console.error(e);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
}
