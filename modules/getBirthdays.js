const { Client } = require('discord.js')
const { BirthdaysDB } = require('./dbObjects.js')
const isValidDate = require('./isValidDate.js')

/**
 * @param {Client} client
 **/
module.exports = async (client) => {
  let todayDate = new Date()
  let today = [todayDate.getUTCMonth() + 1, todayDate.getUTCDate()].join('-')
  let msg = []

  let birthdays = await BirthdaysDB.findAll({
    where: { birthday: today },
  })

  let leaps = await BirthdaysDB.findAll({
    where: { birthday: '2-29' },
  })

  if (birthdays.length) {
    for (birthday of birthdays) {
      let username = client.users.cache.get(birthday.get('discord_id')).username

      if (birthday.get('birthday') === today)
        msg.push(`Happy Birthday **${username}**!\n`)
    }
  }

  if (leaps.length) {
    for (leap of leaps) {
      let username = client.users.cache.get(leap.get('discord_id')).username

      if (today === '2-28' && !isValidDate(29, 2, todayDate.getUTCFullYear())) {
        msg.push(`Happy fake Birthday **${username}**!`)
        break
      }

      if (today === '2-29') msg.push(`Happy leap Birthday **${username}**!\n`)
    }
  }

  if (msg.length)
    client.channels.cache
      .filter((c) => c.name === 'birthdays')
      .each((channel) => channel.send(msg.join('')))
}
