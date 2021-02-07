module.exports = {
  name: `ping`,
  execute(ayanami, message, args) {
    message.channel.send("pong...")
    .then(m => {
      let ping = m.createdTimestamp - message.createdTimestamp

      m.edit(`Pong! My ping is: ${ping}, API Latency: ${Math.round(ayanami.ws.ping)}`)
    })
  }
}