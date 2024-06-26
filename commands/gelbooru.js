const Booru = require('../modules/booru.js');
const { SlashCommandBuilder, EmbedBuilder, Client, CommandInteraction } = require('discord.js');
const booru = new Booru(require('../settings/config.json').GBKey);

let tags = ['-loli*', '-shota*', '-young', '-gore', '-amputee', '-furry', '-anthro'];

function sendEmbed(interaction, booruURL, imageURL) {
	const embed = new EmbedBuilder()
		.setAuthor({ name: `Gelbooru` })
		.setDescription(`[Image URL](${booruURL})`)
		.setImage(imageURL)
		.setColor(45055);
	return interaction.reply({ embeds: [embed] });
}

module.exports = {
	global: true,
	data: new SlashCommandBuilder()
		.setName('gelbooru')
		.setDescription('Search for an image using tags')
		.addStringOption(opt =>
			opt.setName('tags').setDescription('The tags to search for (use _ for multi-word tags)')
		)
		.setNSFW(true),
	/**
	 * @param {Client} ayanami
	 * @param {CommandInteraction} interaction
	 */
	async execute(ayanami, interaction) {
		let intString = interaction.options.getString('tags');

		if (intString) {
			if (
				/\bloli\b/i.test(intString) ||
				/\bgore\b/i.test(intString) ||
				/\bshota\b/i.test(intString)
			) {
				return interaction.reply({
					content:
						"… I don't really want to come close to you, Commander. Lolis, Shota and Gore are not allowed...",
					ephemeral: true,
				});
			}
			tags = tags.concat(interaction.options.getString('tags').split(/ +/));
		}

		try {
			let image = await booru.search('gb', tags);

			if (image.URL.includes('webm') || image.URL.includes('mp4'))
				return interaction.reply(image.URL);
			else sendEmbed(interaction, image.booruURL, image.URL);
		} catch {
			return interaction.reply({
				content: `I'm sorry commander... I didn't find anything${
					intString ? ' for **' + intString + '**' : ''
				}.`,
				ephemeral: true,
			});
		}
	},
};
