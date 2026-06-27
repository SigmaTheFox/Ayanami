const { Client, Interaction, MessageFlags } = require('discord.js');

/**
 * @param {Client} ayanami
 * @param {Interaction} interaction
 */
module.exports = async (ayanami, interaction) => {
	// handle context menu commands
	if (interaction.isContextMenuCommand()) {
		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(ayanami, interaction);
		} catch (err) {
			ayanami.logger.error(err);
			console.error(err);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({
					content: 'There was an error while executing this command!',
					flags: MessageFlags.Ephemeral,
				});
			} else {
				await interaction.reply({
					content: 'There was an error while executing this command!',
					flags: MessageFlags.Ephemeral,
				});
			}
		}
	}
	// handle slash commands
	else if (interaction.isChatInputCommand()) {
		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(ayanami, interaction);
		} catch (err) {
			ayanami.logger.error(err);
			console.error(err);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({
					content: 'There was an error while executing this command!',
					flags: MessageFlags.Ephemeral,
				});
			} else {
				await interaction.reply({
					content: 'There was an error while executing this command!',
					flags: MessageFlags.Ephemeral,
				});
			}
		}
	}

	if (interaction.isAutocomplete()) {
		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.autocomplete(ayanami, interaction);
		} catch (err) {
			ayanami.logger.error(err);
			console.error(err);
		}
	}
};
