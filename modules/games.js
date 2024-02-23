module.exports = async (channels) => {
	const { EmbedBuilder, ChannelType } = require('discord.js');
	const ColorThief = require('colorthief');
	const { Readable } = require("stream");
	const { finished } = require("stream/promises");
	const fs = require('fs');
	const fileDir = `./json/free-games`;
	const URL = 'https://gamerpower.com/api/giveaways?platform=pc';

	// Create the free games directory and rename the old games list if it exists
	if (!fs.existsSync(fileDir)) fs.mkdirSync(fileDir);
	if (fs.existsSync(`${fileDir}/gameList.json`))
		fs.renameSync(`${fileDir}/gameList.json`, `${fileDir}/gameList-old.json`);


	// Fetch the new free games
	const file = fs.createWriteStream(`${fileDir}/gameList.json`);
	const { body } = await fetch(URL);
	await finished(Readable.fromWeb(body).pipe(file));
	file.close();
	listGames();

	async function listGames() {
		let freeGames = JSON.parse(fs.readFileSync(`${fileDir}/gameList.json`));
		let freeGamesOld = [];

		// If it exists, parse the old games list
		if (fs.existsSync(`${fileDir}/gameList-old.json`)) {
			freeGamesOld = JSON.parse(
				fs.readFileSync(`${fileDir}/gameList-old.json`)
			);
		}

		let game_embeds = [];

		// Loop through all games in the new games list.
		for (game of freeGames) {
			// If the embed array has 5 embeds in it, stop the loop.
			// If instead the old games list is empty or the current new game's ID corresponds to the ID of an old game, skip the loop
			if (game_embeds.length === 5) break;

			if (
				freeGamesOld.length !== 0 &&
				freeGamesOld.some((g) => g.id === game.id)
			)
				continue;
			else {
				// Get the dominant color of the game's image
				// And add it alongside other deal info to an embed
				let color = await ColorThief.getColor(game.image);

				game_embeds.push(
					new EmbedBuilder()
						.setTitle(game.title)
						.setURL(game['open_giveaway'])
						.setImage(game.image)
						.setColor(color)
						.setDescription(game.description)
						.addFields([
							{ name: 'Type', value: game.type },
							{ name: 'Worth', value: game.worth },
							{ name: 'Platforms', value: game.platforms },
							{ name: 'Instructions', value: game.instructions },
						])
				);
			}
		}

		if (game_embeds.length === 0) return console.log('No new free games');

		// Loop through all channels passed to the file and find the corresponding channel's server's free games role
		// Afterwards send the embeds to the free games channel, and if it's an announcement channel, crosspost it
		channels.each(async (channel) => {
			let free_games_role = channel.guild.roles.cache.find(
				(r) => r.name.toLowerCase() === 'free games'
			).id;

			let msg = await channel.send({
				content: `<@&${free_games_role}>`,
				embeds: game_embeds,
			});

			if (msg.channel.type === ChannelType.GuildAnnouncement) msg.crosspost();
		});
	};
};
