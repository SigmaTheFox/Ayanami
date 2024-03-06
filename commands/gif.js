const { SlashCommandBuilder, Client, CommandInteraction, EmbedBuilder } = require("discord.js");
const { waifuKey } = require("../settings/config.json");
const gifs = require("../json/gifs.json");
const { waifuTypes } = require("../json/waifuTypes.json");

const validGifTypes = Object.keys(waifuTypes);

module.exports = {
	global: true,
	data: new SlashCommandBuilder()
		.setName("gif")
		.setDescription("Send a reaction gif of a specific theme")
		.addStringOption((opt) =>
			opt.setName("gif").setDescription("The gif theme").setAutocomplete(true).setRequired(true)
		)
		.addUserOption((opt) => opt.setName("user").setDescription("The user").setRequired(false)),
	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	async autocomplete(interaction) {
		const focused = interaction.options.getFocused();
		const filtered = validGifTypes.filter((choice) => choice.startsWith(focused)).slice(0, 24);
		await interaction.respond(filtered.map((choice) => ({ name: choice, value: choice })));
	},
	/**
	 * @param {Client} ayanami
	 * @param {CommandInteraction} interaction
	 */
	async execute(ayanami, interaction) {
		const user = interaction.options.getUser("user"),
			gifType = interaction.options.getString("gif");

		if (!validGifTypes.includes(gifType))
			return await interaction.reply({
				content: `**${gifType}** isn't a valid gif type.\n## Here's a list of valid types:\n${validGifTypes
					.map((gif) => `${gif}`)
					.join(",   ")}`,
				ephemeral: true,
			});

		await interaction.deferReply({ ephemeral: false });

		let imageURL = await getGif(interaction.options.getString("gif")),
			gif = waifuTypes[gifType];

		const embed = new EmbedBuilder()
			.setAuthor({
				name: ayanami.user.username,
				iconURL: ayanami.user.displayAvatarURL({ dynamic: true }),
			})
			.setImage(imageURL)
			.setColor(45055);

		switch (gifType) {
			case "birthday":
				if (user) {
					embed.setDescription(
						ReplaceText(gif.textUser, {
							user: user,
							emote: gif.emote,
						})
					);

					interaction.editReply({ embeds: [embed] });
					break;
				} else {
					embed.setDescription(ReplaceText(gif.textSolo, { emote: gif.emote }));
					interaction.editReply({ embeds: [embed] });
					break;
				}
			case "fuck":
				if (user === interaction.user) {
					embed.setDescription(
						ReplaceText(gif.textSelf, {
							interactionUser: interaction.user,
						})
					);

					interaction.editReply({ embeds: [embed] });
					break;
				} else if (user) {
					embed.setDescription(
						ReplaceText(gif.textUser, {
							user: user,
							interactionUser: interaction.user,
						})
					);
					interaction.editReply({ embeds: [embed] });
					break;
				} else {
					embed.setDescription(
						ReplaceText(gif.textSolo, {
							interactionUser: interaction.user,
						})
					);
					interaction.editReply({ embeds: [embed] });
					break;
				}
			case "lewd":
				embed.setDescription(ReplaceText(gif.textSolo, { emote: gif.emote }));
				interaction.editReply({ embeds: [embed] });
				break;
			default:
				if (gif.size > 0) {
					if (user) {
						embed.setDescription(
							ReplaceText(gif.textUser, {
								user: user,
								emote: gif.emote,
								interactionUser: interaction.user,
							})
						);
						interaction.editReply({ embeds: [embed] });
						break;
					} else {
						embed.setDescription(
							ReplaceText(gif.textSolo, {
								user: user,
								emote: gif.emote,
								interactionUser: interaction.user,
							})
						);
						interaction.editReply({ embeds: [embed] });
						break;
					}
				}
				interaction.editReply({ embeds: [embed] });
				break;
		}
	},
};

function ReplaceText(text, { user = "", emote = "", interactionUser = "" }) {
	if (/{{interactionUser}}/gi.test(text)) text = text.replace("{{interactionUser}}", interactionUser);
	if (/{{user}}/gi.test(text)) text = text.replace("{{user}}", user);
	if (/{{emote}}/gi.test(text)) text = text.replace("{{emote}}", emote);
	return text;
}

async function getGif(gifName) {
	if (/(birthday|fuck|lewd)/.test(gifName)) {
		return gifs[gifName][Math.floor(Math.random() * gifs[gifName].length)];
	}

	try {
		const res = await fetch("https://waifu.it/api/v4/" + gifName, {
			headers: { Authorization: waifuKey },
		});
		const json = await res.json();
		return json["url"];
	} catch (err) {
		console.error(err);
	}
}
