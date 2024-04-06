const {
	SlashCommandBuilder,
	Client,
	CommandInteraction,
	EmbedBuilder,
	AutocompleteInteraction,
} = require('discord.js');

const { adminPass, ip, port, serverPass } = require('../settings/config.json').palworld;
const { PalWrapper } = require('@sigmathefox/palwrapper');
const pal = new PalWrapper(adminPass, {
	serverIP: ip,
	APIPort: port,
});

module.exports = {
	global: true,
	data: new SlashCommandBuilder()
		.setName('palworld')
		.setDescription("Get data about Sigma's Palworld server")
		.addSubcommand(sub => sub.setName('info').setDescription('Get server info'))
		.addSubcommand(sub =>
			sub.setName('online').setDescription('List all currently online players.')
		)
		.addSubcommand(sub =>
			sub
				.setName('player')
				.setDescription("Get a specified player's stats")
				.addStringOption(opt =>
					opt
						.setName('player')
						.setDescription('The player name')
						.setRequired(true)
						.setAutocomplete(true)
				)
		),
	/**
	 * @param {Client} ayanami
	 * @param {AutocompleteInteraction} interaction
	 */
	async autocomplete(ayanami, interaction) {
		const focused = interaction.options.getFocused();
		const players = await pal.getPlayers();
		const filtered = Array.from(
			players.filter(player => player.name.startsWith(focused))
		).slice(0, 24);
		await interaction.respond(
			filtered.map(choice => ({ name: choice.name, value: choice.name }))
		);
	},
	/**
	 *
	 * @param {Client} ayanami
	 * @param {CommandInteraction} interaction
	 */
	async execute(ayanami, interaction) {
		if (interaction.options.getSubcommand() === 'info') {
			const serverIp = `${ip}:${port}`,
				{ name, version } = await pal.getServerInfo(),
				{ currentPlayerNum, maxPlayerNum } = await pal.getServerMetrics();

			const embed = new EmbedBuilder()
				.setTitle(name)
				.setColor(45055)
				.setAuthor({
					name: interaction.user.globalName,
					iconURL: interaction.user.displayAvatarURL({ forceStatic: false }),
				})
				.addFields([
					{ name: 'Server IP', value: serverIp, inline: true },
					{ name: 'Password', value: serverPass, inline: false },
					{ name: 'Version', value: version, inline: true },
					{
						name: 'Players',
						value: `${currentPlayerNum}/${maxPlayerNum}`,
						inline: true,
					},
				]);

			return await interaction.reply({ embeds: [embed] });
		} else if (interaction.options.getSubcommand() === 'online') {
			const players = await pal.getPlayers(),
				playerList = players.map(player => `- ${player.name}`).join(',\n');

			const embed = new EmbedBuilder()
				.setTitle('Palworld Players')
				.setColor(45055)
				.setAuthor({
					name: interaction.user.globalName,
					iconURL: interaction.user.displayAvatarURL({ forceStatic: false }),
				})
				.setDescription(
					`## Online\n${
						playerList.length === 0 ? 'No one is currently online' : playerList
					}`
				);

			return await interaction.reply({ embeds: [embed] });
		} else {
			const chosenPlayer = interaction.options.getString('player', true),
				players = await pal.getPlayers(),
				playerFiltered = players.find(player => player.name == chosenPlayer);

			const embed = new EmbedBuilder()
				.setTitle(playerFiltered.name)
				.setColor(45055)
				.setAuthor({
					name: interaction.user.globalName,
					iconURL: interaction.user.displayAvatarURL({ forceStatic: false }),
				})
				.setFields([
					{ name: 'Level', value: playerFiltered.level.toString(), inline: true },
					{
						name: 'Ping',
						value: Math.floor(playerFiltered.ping).toString(),
						inline: true,
					},
					{
						name: 'Location',
						value: `X: ${playerFiltered.location_x.toString()}\nY: ${playerFiltered.location_y.toString()}`,
					},
				]);
			interaction.reply({ embeds: [embed] });
		}
	},
};
