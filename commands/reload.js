const {
	SlashCommandBuilder,
	Client,
	CommandInteraction,
	PermissionFlagsBits,
	AutocompleteInteraction,
} = require('discord.js');

module.exports = {
	private: true,
	data: new SlashCommandBuilder()
		.setName('reload')
		.setDescription('Reloads a command')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.addStringOption(opt =>
			opt
				.setName('command')
				.setDescription('The command to reload')
				.setRequired(true)
				.setAutocomplete(true)
		),
	/**
	 * @param {Client} ayanami
	 * @param {AutocompleteInteraction} interaction
	 */
	async autocomplete(ayanami, interaction) {
		const focused = interaction.options.getFocused();
		const filtered = Array.from(
			ayanami.commands.filter(choice => choice.data.name.startsWith(focused)).keys()
		).slice(0, 24);
		await interaction.respond(filtered.map(choice => ({ name: choice, value: choice })));
	},
	/**
	 *
	 * @param {Client} ayanami
	 * @param {CommandInteraction} interaction
	 */
	async execute(ayanami, interaction) {
		const commandName = interaction.options.getString('command', true).toLowerCase();
		const command = interaction.client.commands.get(commandName);

		if (!command) {
			return interaction.reply(`There is no command with name \`${commandName}\`!`);
		}

		delete require.cache[require.resolve(`./${command.data.name}.js`)];

		try {
			interaction.client.commands.delete(command.data.name);
			const newCommand = require(`./${command.data.name}.js`);
			interaction.client.commands.set(newCommand.data.name, newCommand);
			await interaction.reply(`Command \`${newCommand.data.name}\` was reloaded!`);
		} catch (err) {
			console.error(err);
			ayanami.logger.error(err);
			await interaction.reply(
				`There was an error while reloading a command \`${command.data.name}\`:\n\`${err.message}\``
			);
		}
	},
};
