const log4js = require("log4js");

log4js.configure({
    appenders: {
        file: {
            type: 'dateFile', filename: './logs/bot.log', pattern: 'yyyy-MM-dd'
        }
    },
    categories: {
        default: { appenders: ['file'], level: 'all' }
    }
})

module.exports = log4js.getLogger('file')
