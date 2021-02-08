const { OpenWeather } = require("../settings/config.json")
const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');
const logs = require('../modules/logger');

module.exports = {
    name: "weather",
    category: "utility",
    description: "I'll tell you what the weather's like.",
    args: true,
    usage: '<City name>" (you can also add the State Code and Country Code, separate with " | ". As an example <New York | US> or <Portland | OR | US>)',
    async execute(ayanami, message, args) {
        var query = args.join("+").split("+|+").join(",")
        var URL = `http://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${OpenWeather}`

        try {
            var request = await fetch(URL);
            var json = await request.json();

            var icon = `http://openweathermap.org/img/wn/${json.weather[0].icon}@2x.png`
            var description = json.weather[0].description
            var tempC = Math.round(json.main.temp - 273.15)
            var tempF = Math.round(tempC * 9 / 5 + 32)
            var humidity = json.main.humidity + "%"
            var windSpeedC = Math.round(json.wind.speed * 3.6) + "km/h"
            var windSpeedF = Math.round(json.wind.speed * 2.237) + "mph"
            var country = json.sys.country
            var feelsLikeC = Math.round(json.main.feels_like - 273.15)
            var feelsLikeF = Math.round(feelsLikeC * 9 / 5 + 32)

            const embed = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({ format: 'png', dynamic: true, size: 256 }))
                .setTitle(`${json.name}, ${country}`)
                .setDescription(`**${description}**`)
                .setThumbnail(icon)
                .setColor("ORANGE")
                .addFields(
                    {
                        name: "Temperature",
                        value: `${tempC}°C (${tempF}°F)`,
                        inline: true
                    },
                    {
                        name: "Humidity",
                        value: humidity,
                        inline: true
                    },
                    {
                        name: "Feels Like",
                        value: `${feelsLikeC}°C (${feelsLikeF}°F)`,
                        inline: true
                    },
                    {
                        name: "Wind Speed",
                        value: `${windSpeedC} (${windSpeedF})`,
                        inline: true
                    }
                )
                .setFooter("Data received from OpenWeatherMap")

            return message.channel.send({ embed })
        } catch (error) {
            message.reply("I couldn't find the specified location.")
            logs.error(error)
            return console.error(error)
        }
    }
}