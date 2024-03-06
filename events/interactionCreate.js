const { Client, Interaction } = require("discord.js");

/**
 * @param {Client} ayanami
 * @param {Interaction} interaction
 */
module.exports = async (ayanami, interaction) => {
	if (interaction.isChatInputCommand()) {
		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(ayanami, interaction);
		} catch (err) {
			ayanami.logger.error(err);
			console.error(err);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({
					content: "There was an error while executing this command!",
					ephemeral: true,
				});
			} else {
				await interaction.reply({
					content: "There was an error while executing this command!",
					ephemeral: true,
				});
			}
		}
	} else if (interaction.isAutocomplete) {
		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.autocomplete(interaction);
		} catch (err) {
			ayanami.logger.error(err);
			console.error(err);
		}
	}
};
