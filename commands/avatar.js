const { SlashCommandBuilder, CLient, CommandInteraction, ChannelType } = require("discord.js");

module.exports = {
	global: true,
	data: new SlashCommandBuilder()
		.setName("avatar")
		.setDescription("Get someone else's or your own profile picture")
		.addSubcommand((cmd) =>
			cmd
				.setName("user")
				.setDescription("Get the user's profile picture")
				.addUserOption((opt) => opt.setName("user").setDescription("The user").setRequired(false))
		)
		.addSubcommand((cmd) =>
			cmd
				.setName("server")
				.setDescription("Get the user's server profile picture")
				.addUserOption((opt) => opt.setName("user").setDescription("The user").setRequired(false))
		),
	/**
	 * @param {Client} ayanami
	 * @param {CommandInteraction} interaction
	 */
	async execute(ayanami, interaction) {
		if (interaction.options.getSubcommand() === "user") {
			let target = interaction.options.getUser("user") || interaction.user;
			await interaction.reply(
				target.displayAvatarURL({
					format: "png",
					dynamic: true,
					size: 4096,
				})
			);
		} else if (interaction.options.getSubcommand() === "server") {
			if (interaction.channel.type !== ChannelType.DM)
				return interaction.reply("This command only works in servers");
			let target = interaction.options.getMember("user") || interaction.member;
			await interaction.reply(
				target.displayAvatarURL({
					format: "png",
					dynamic: true,
					size: 4096,
				})
			);
		}
	},
};
