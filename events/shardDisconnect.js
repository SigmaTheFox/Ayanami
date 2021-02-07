const logs = require('../modules/logger');

module.exports = (ayanami, d, id) => {
    logs.fatal(`Disconnected - ${d}`);
    console.error('Disconnected - ', d);
}