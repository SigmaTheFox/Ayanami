const { SlashCommandBuilder, Client, CommandInteraction } = require("discord.js");

module.exports = {
	global: false,
	data: new SlashCommandBuilder().setName("togglefx").setDescription("Toggle fxtwitter on/off"),
	/**
	 * @param {Client} ayanami
	 * @param {CommandInteraction} interaction
	 */
	async execute(ayanami, interaction) {
		let member = interaction.member,
			findRole = interaction.guild.roles.cache.find((r) => r.name === "fxtwitter");

		if (!member.roles.cache.has(findRole.id)) {
			member.roles.add(findRole);
			return interaction.reply({
				content: "Fxtwitter is now Enabled",
				ephemeral: true,
			});
		} else if (member.roles.cache.has(findRole.id)) {
			member.roles.remove(findRole);
			return interaction.reply({
				content: "Fxtwitter is now Disabled",
				ephemeral: true,
			});
		}
	},
};
