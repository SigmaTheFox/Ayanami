const { warn } = require('console');

module.exports = async (channel, role) => {
	const fs = require('fs');
	const fetch = require('node-fetch');
	const homeDir = require('os').homedir();
	const fileDir = `${homeDir}/.config/free-games`;

	if (!fs.existsSync(`${homeDir}/.config/free-games`))
		fs.mkdirSync(`${fileDir}`);
	if (fs.existsSync(`${fileDir}/gameList.json`))
		fs.renameSync(`${fileDir}/gameList.json`, `${fileDir}/gameList-old.json`);

	fetch(
		'https://proxy.gxcorner.games/content/free-games?_limit=50&_sort=order:ASC'
	).then((res) => {
		new Promise((resolve, reject) => {
			const file = fs.createWriteStream(`${fileDir}/gameList.json`);
			res.body.pipe(file);
			res.body.on('end', () => resolve(listGames()));
			file.on('error', reject);
		});
	});

	const listGames = () => {
		let freeGamesRaw = fs.readFileSync(`${fileDir}/gameList.json`);
		let freeGames = JSON.parse(freeGamesRaw);
		let freeGamesOld = [];
		if (fs.existsSync(`${fileDir}/gameList-old.json`)) {
			let freeGamesOldRaw = fs.readFileSync(`${fileDir}/gameList-old.json`);
			freeGamesOld = JSON.parse(freeGamesOldRaw);
		}

		let msg = [];

		for (game of freeGames) {
			if (game.store?.id === 3 || game.store?.id == 4 || game.store?.id === 11)
				continue;

			if (
				freeGamesOld.length !== 0 &&
				freeGamesOld.some((g) => g.game.title === game.game.title)
			) {
				continue;
			} else {
				msg.push(`> * [${game.game.title}](${game.url}) (${game.store?.name})`);
		}}

		if (msg.length === 0) return console.log('No new free games');

		msg.unshift(`${role}\n`);
		return channel.send(msg.join('\n'));
	};
};
