const cron = require('node-cron')
const getBirthdays = require('../modules/getBirthdays')

module.exports = (ayanami) => {
  ayanami.channels.cache
    .filter((c) => c.name === 'roles')
    .each((channel) => channel.messages.fetch())
  console.log(`Taste the power of the demon...!`)
  ayanami.logger.trace(`Taste the power of the demon...!`)

  cron.schedule(
    '0 0 * * *',
    () => {
      getBirthdays(ayanami)
    },
    {
      timezone: 'Etc/UTC',
    }
  )
}
