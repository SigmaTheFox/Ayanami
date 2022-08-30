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
        await interaction.reply({ content: "There was an error trying to execute this command!" })
    } 
}
