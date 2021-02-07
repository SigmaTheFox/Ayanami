const logs = require('../modules/logger');

module.exports = (ayanami, id, r) => {
    logs.info(`I'm back, commander - ${r}`);
    console.log(`I'm back, commander - ${r}`);
}