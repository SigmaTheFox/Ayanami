const { SlashCommandBuilder, Client, CommandInteraction } = require("discord.js");
const { BirthdaysDB } = require("../modules/dbObjects");
const isValidDate = require("../modules/isValidDate");

module.exports = {
	global: true,
	data: new SlashCommandBuilder()
		.setName("birthday")
		.setDescription("Set or remove your birthday to Ayanami's reminder, or get someone else's")
		.addSubcommand((cmd) =>
			cmd
				.setName("set")
				.setDescription("Set when your birthday is")
				.addIntegerOption((opt) =>
					opt
						.setName("month")
						.setRequired(true)
						.setMinValue(1)
						.setMaxValue(12)
						.setDescription("The month you were born at")
				)
				.addIntegerOption((opt) =>
					opt
						.setName("day")
						.setRequired(true)
						.setMinValue(1)
						.setMaxValue(31)
						.setDescription("The day you were born at")
				)
		)
		.addSubcommand((cmd) =>
			cmd.setName("remove").setDescription("Remove your birthday from the reminder")
		)
		.addSubcommand((cmd) =>
			cmd
				.setName("get")
				.setDescription("Get someone else's birthday")
				.addUserOption((opt) =>
					opt.setName("user").setDescription("The user to get the birthday of").setRequired(true)
				)
		),
	/**
	 * @param {Client} ayanami
	 * @param {CommandInteraction} interaction
	 */
	async execute(ayanami, interaction) {
		if (interaction.options.getSubcommand() === "set") return setBirthday(ayanami, interaction);
		else if (interaction.options.getSubcommand() === "remove")
			return removeBirthday(ayanami, interaction);
		else if (interaction.options.getSubcommand() === "get") return getBirthday(interaction);
	},
};

/**
 * @param {Client} client
 * @param {CommandInteraction} interaction
 */
async function setBirthday(client, interaction) {
	let day = interaction.options.getInteger("day"),
		month = interaction.options.getInteger("month"),
		userId = interaction.user.id;

	if (isValidDate(day, month, 2020)) {
		let result = await BirthdaysDB.findOrCreate({
			where: { discord_id: userId },
			defaults: { birthday: `${month}-${day}` },
		});

		let created = result[1];

		if (!created) {
			let userBirthday = result[0].get("birthday");

			return interaction.reply({
				content: `You already set your birthday to ${userBirthday}. If it's incorrect, you can use \`/birthday remove\` to set it again.`,
				ephemeral: true,
			});
		}

		console.log(`${interaction.user.username} set their birthday to ${month}-${day}`);
		client.logger.log(`${interaction.user.username} set their birthday to ${month}-${day}`);

		return interaction.reply({
			content: `You set your birthday to ${month}-${day}. If it's incorrect, you can use \`/birthday remove\` to set it again.`,
			ephemeral: true,
		});
	} else
		return interaction.reply({
			content: `${month}-${day} isn't a valid date`,
			ephemeral: true,
		});
}

/**
 * @param {Client} client
 * @param {CommandInteraction} interaction
 */
async function removeBirthday(client, interaction) {
	let userId = interaction.user.id,
		result = await BirthdaysDB.findOne({
			where: { discord_id: userId },
		});

	if (result) {
		let destroyed = await BirthdaysDB.destroy({
			where: { discord_id: userId },
		});

		if (!destroyed)
			return interaction.reply({
				content: "You didn't set your birthday yet. use `/birthday set` to do so",
				ephemeral: true,
			});

		console.log(`${interaction.user.username} removed their birthday`);
		client.logger.log(`${interaction.user.username} removed their birthday`);

		return interaction.reply({
			content: "Successfully removed your birthday",
			ephemeral: true,
		});
	}
}

/**
 * @param {CommandInteraction} interaction
 */
async function getBirthday(interaction) {
	let user = interaction.options.getUser("user"),
		birthday = await BirthdaysDB.findOne({
			where: { discord_id: user.id },
		});

	if (!birthday) return interaction.reply(`**${user.username}** doesn't have their birthday set.`);
	return interaction.reply(`**${user.username}'s** birthday is ${birthday.get("birthday")}`);
}
