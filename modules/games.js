module.exports = async (channels) => {
	const { EmbedBuilder } = require('discord.js');
	const fs = require('fs');
	const fetch = require('node-fetch');
	const homeDir = require('os').homedir();
	const fileDir = `${homeDir}/.config/free-games`;
	const URL = 'https://gamerpower.com/api/giveaways?platform=pc';

	if (!fs.existsSync(fileDir)) fs.mkdirSync(fileDir);
	if (fs.existsSync(`${fileDir}/gameList.json`))
		fs.renameSync(`${fileDir}/gameList.json`, `${fileDir}/gameList-old.json`);

	fetch(URL).then((res) => {
		new Promise((resolve, reject) => {
			const file = fs.createWriteStream(`${fileDir}/gameList.json`);
			res.body.pipe(file);
			res.body.on('end', () => resolve(listGames()));
			file.on('error', reject);
		});
	});

	const listGames = () => {
		let freeGames = JSON.parse(fs.readFileSync(`${fileDir}/gameList.json`));
		let freeGamesOld = [];

		if (fs.existsSync(`${fileDir}/gameList-old.json`)) {
			freeGamesOld = JSON.parse(
				fs.readFileSync(`${fileDir}/gameList-old.json`)
			);
		}

		let game_embeds = [];

		for (game of freeGames) {
			if (game_embeds.length === 5) break;

			if (
				freeGamesOld.length !== 0 &&
				freeGamesOld.some((g) => g.id === game.id)
			)
				continue;
			else
				game_embeds.push(
					new EmbedBuilder()
						.setTitle(game.title)
						.setURL(game['open_giveaway'])
						.setImage(game.image)
						.setDescription(game.description)
						.addFields([
							{ name: 'Type', value: game.type },
							{ name: 'Worth', value: game.worth },
							{ name: 'Platforms', value: game.platforms },
							{ name: 'Instructions', value: game.instructions },
						])
				);
		}

		if (game_embeds.length === 0) return console.log('No new free games');

		channels.each(async (channel) => {
			let free_games_role = channel.guild.roles.cache.find(
				(r) => r.name.toLowerCase() === 'free games'
			).id;

			let msg = await channel.send({
				content: `<@&${free_games_role}>`,
				embeds: game_embeds,
			});
			msg.crosspost();
		});
	};
};
