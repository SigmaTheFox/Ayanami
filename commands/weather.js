const { SlashCommandBuilder, EmbedBuilder, Client, CommandInteraction } = require("discord.js");
const fetch = require("node-fetch");
const { OpenWeather } = require("../settings/config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("weather")
        .setDescription("Get the current weather data for the specified location")
        .addStringOption(opt =>
            opt.setName("city")
                .setDescription("The city to get the weather for")
                .setRequired(true))
        .addStringOption(opt =>
            opt.setName("state_code")
                .setDescription("The state code of the city to narrow down search results"))
        .addStringOption(opt =>
            opt.setName("country_code")
                .setDescription("The country code of the city to narrow down search results")),
    /**
     * @param {Client} ayanami
     * @param {CommandInteraction} interaction
     */
    async execute(ayanami, interaction) {
        let city = interaction.options.getString("city").replace(/ +/gi, "+"),
            state_code = interaction.options.getString("state_code"),
            country_code = interaction.options.getString("country_code"),
            query = `${city}${state_code ? "," + state_code : ""}${country_code ? "," + country_code : ""}`,
            URL = `http://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${OpenWeather}`,
            icon, description, tempC, tempF, humidity, windSpeedC, windSpeedF, country, feelsLikeC, feelsLikeF, embed;

        try {
            let request = await fetch(URL);
            let json = await request.json();

            icon = `http://openweathermap.org/img/wn/${json.weather[0].icon}@2x.png`;
            description = json.weather[0].description;
            tempC = Math.round(json.main.temp - 273.15);
            tempF = Math.round(tempC * 9 / 5 + 32);
            humidity = json.main.humidity + "%";
            windSpeedC = Math.round(json.wind.speed * 3.6) + "km/h";
            windSpeedF = Math.round(json.wind.speed * 2.237) + "mph";
            country = json.sys.country;
            feelsLikeC = Math.round(json.main.feels_like - 273.15);
            feelsLikeF = Math.round(feelsLikeC * 9 / 5 + 32);

            embed = new EmbedBuilder()
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
                .setTitle(`${json.name}, ${country}`)
                .setDescription(`**${description}**`)
                .setThumbnail(icon)
                .setColor("Orange")
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
                    })
                .setFooter({ text: "Data received from OpenWeatherMap" });

            interaction.reply({ embeds: [embed], ephemeral: true });
        } catch (err) {
            ayanami.logger.error(err);
            console.error(err);
            interaction.reply({ content: "I couldn't find the specified location", ephemeral: true });
        }
    }
}
