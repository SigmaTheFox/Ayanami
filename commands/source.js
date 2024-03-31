const { SlashCommandBuilder, Client, CommandInteraction, EmbedBuilder } = require('discord.js');
const sagiri = require('sagiri');
const sagiriClient = sagiri(require('../settings/config.json').sauceKey);

async function getSource(client, imgURL) {
	if (!imgURL.includes('http://') && !imgURL.includes('https://'))
		return 'Please enter a valid URL';

	let min_sim = 60,
		filteredResults,
		output = {
			link: `https://saucenao.com/search.php?db=999&url=${encodeURIComponent(imgURL)}`,
			results: [],
		};

	try {
		let results = await sagiriClient(
			imgURL /*, {
			mask: [5, 9, 12, 16, 25, 26, 27, 29, 34, 41],
		}*/
		);

		filteredResults = results.filter(r => r.similarity >= min_sim);
	} catch (err) {
		console.error(err);
		client.logger.error(err);
		return 'There was an error';
	}

	if (!filteredResults || filteredResults.length === 0) {
		output.results.push({ name: 'Nothing Found', value: '\u200b' });
	} else {
		for (item of filteredResults) {
			if (output.results.length === 25) break;
			output.results.push({ name: `**${item.site}**`, value: item.url });
		}
	}
	return output;
}

function sendEmbed(interaction, source, imgURL) {
	const embed = new EmbedBuilder()
		.setAuthor({
			name: interaction.user.username,
			iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
		})
		.setDescription(`[[View all results]](${source.link})`)
		.setColor(45055)
		.addFields(source.results)
		.setThumbnail(imgURL)
		.setFooter({ text: 'Powered by Saucenao' });

	interaction.reply({ embeds: [embed] });
}

let source;

module.exports = {
	global: true,
	data: new SlashCommandBuilder()
		.setName('source')
		.setDescription('Get the source of an image')
		.addSubcommand(cmd =>
			cmd
				.setName('url')
				.setDescription('Get the source of an image using a URL')
				.addStringOption(opt =>
					opt
						.setName('link')
						.setDescription('The direct URL to the image')
						.setRequired(true)
				)
		)
		.addSubcommand(cmd =>
			cmd
				.setName('attachment')
				.setDescription('Get the source of an image using an attachment')
				.addAttachmentOption(opt =>
					opt.setName('image').setDescription('The image attachment').setRequired(true)
				)
		),
	/**
	 * @param {Client} ayanami
	 * @param {CommandInteraction} interaction
	 */
	async execute(ayanami, interaction) {
		if (interaction.options.getSubcommand() === 'url') {
			source = await getSource(ayanami, interaction.options.getString('link'));
			if (typeof source === 'string') return interaction.reply(source);
			else return sendEmbed(interaction, source, interaction.options.getString('link'));
		} else if (interaction.options.getSubcommand() === 'attachment') {
			source = await getSource(ayanami, interaction.options.getAttachment('image').url);
			if (typeof source === 'string') return interaction.reply(source);
			else
				return sendEmbed(
					interaction,
					source,
					interaction.options.getAttachment('image').url
				);
		}
	},
};
