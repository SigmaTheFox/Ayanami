const { SlashCommandBuilder, EmbedBuilder, Client, CommandInteraction } = require("discord.js");
const { DeepLToken } = require("../settings/config.json");
const DeepL = require("../modules/DeepL.js");
const deepl = new DeepL(DeepLToken);

module.exports = {
	global: true,
	data: new SlashCommandBuilder()
		.setName("translate")
		.setDescription("Translate text from one language to anther")
		.addStringOption((opt) =>
			opt
				.setName("language")
				.setDescription("The language to translate to")
				.addChoices(
					{ name: "Bulgarian", value: "BG" },
					{ name: "Czech", value: "CS" },
					{ name: "Danish", value: "DA" },
					{ name: "Dutch", value: "NL" },
					{ name: "English (American)", value: "EN-US" },
					{ name: "English (British)", value: "EN-GB" },
					{ name: "Estonian", value: "ET" },
					{ name: "Finnish", value: "FI" },
					{ name: "French", value: "FR" },
					{ name: "German", value: "DE" },
					{ name: "Hungarian", value: "HU" },
					{ name: "Indonesian", value: "ID" },
					{ name: "Italian", value: "IT" },
					{ name: "Japanese", value: "JA" },
					{ name: "Polish", value: "PL" },
					{ name: "Portuguese", value: "PT-PT" },
					{ name: "Portuguese (Brazilian)", value: "PT-BR" },
					{ name: "Romanian", value: "RO" },
					{ name: "Russian", value: "RU" },
					{ name: "Slovak", value: "SK" },
					{ name: "Slovenian", value: "SL" },
					{ name: "Spanish", value: "ES" },
					{ name: "Swedish", value: "SV" },
					{ name: "Turkish", value: "TR" },
					{ name: "Ukrainian", value: "UK" }
				)
				.setRequired(true)
		)
		.addStringOption((opt) =>
			opt.setName("text").setDescription("The text to translate").setRequired(true)
		),
	/**
	 * @param {Client} ayanami
	 * @param {CommandInteraction} interaction
	 */
	async execute(ayanami, interaction) {
		let language = interaction.options.getString("language"),
			input = interaction.options.getString("text");

		if (input.length > 1024)
			return interaction.reply({
				content: "The text to translate can't be longer than 1024 characters.",
				ephemeral: true,
			});

		try {
			let { text } = await deepl.translate(input, language);
			if (text.length > 1024)
				return interaction.reply({
					content:
						"The translated text is longer than 1024 characters.\nYou might want to use https://translate.google.com",
					ephemeral: true,
				});

			let embed = new EmbedBuilder()
				.setColor(45055)
				.setFields([
					{ name: "Input Sentence", value: input },
					{ name: "Translation", value: text },
				])
				.setFooter({ text: "Powered by DeepL" });

			interaction.reply({ embeds: [embed] });
		} catch (err) {
			console.log(err);
			ayanami.logger.error(err);
			return interaction.reply({
				content: "There was an error while translating. Try again later.",
				ephemeral: true,
			});
		}
	},
};
