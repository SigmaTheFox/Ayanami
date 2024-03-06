module.exports = (ayanami, d, id) => {
	ayanami.logger.fatal(`Disconnected - ${d}`);
	console.error("Disconnected - ", d);
};
