const sagiri = require('sagiri');
const { sauceKey } = require('../settings/config.json');
const logs = require('../modules/logger');
const client = sagiri(sauceKey);
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'source',
    aliases: ['sauce'],
    async execute(ayanami, message, args) {
        if (message.attachments.size == 0 && !args.length) return message.reply("Please attach an image or enter a link to an image.");

        var img;
        var min_sim = 55;

        // Page variables
        var dab;
        var pxv;
        var ydr;

        // Check if attachment or URL
        if (message.attachments.size == 0) {
            img = args.join(" ");
            // Check if valid URL
            if (!img.includes("http://") && !img.includes("https://")) return message.reply("Please enter a valid url");
        } else {
            img = message.attachments.first().url;
        }

        const sauceLink = `https://saucenao.com/search.php?db=999&url=${img}`;

        try {
            var results = await client(img);

            // Filtered results
            var danbooru = results.find(r => r.index == 9);
            var pixiv = results.find(r => r.index == 5);
            var yandere = results.find(r => r.index == 12);

        } catch (err) {
            console.error(err);
            logs.error(err);
            return message.reply("There was an error.");
        }

        // Determine variable value
        if (!danbooru || (Array.isArray(danbooru) && (danbooru[0].similarity < min_sim)) || (danbooru.similarity < min_sim)) {
            dab = "Nothing found";
        } else if (Array.isArray(danbooru) == true) {
            dab = danbooru[0].url;
        } else {
            dab = danbooru.url;
        }

        if (!pixiv || (Array.isArray(pixiv) && (pixiv[0].similarity < min_sim)) || (pixiv.similarity < min_sim)) {
            pxv = "Nothing found";
        } else if (Array.isArray(pixiv) == true) {
            pxv = pixiv[0].url;
        } else {
            pxv = pixiv.url;
        }

        if (!yandere || (Array.isArray(yandere) && (yandere[0].similarity < min_sim)) || (yandere.similarity < min_sim)) {
            ydr = "Nothing found";
        } else if (Array.isArray(yandere) == true) {
            ydr = yandere[0].url;
        } else {
            ydr = yandere.url;
        }


        const Embed = new MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL({ format: 'png', dynamic: true }))
            .setDescription(`[[View full results]](${sauceLink})`)
            .setColor(45055)
            .addFields([
                {
                    name: `**Pixiv**`,
                    value: pxv
                },
                {
                    name: `**Danbooru**`,
                    value: dab
                },
                {
                    name: '**Yande.re**',
                    value: ydr
                }
            ])
            .setThumbnail(img)
            .setFooter("Powered by Saucenao")

        message.channel.send(Embed)
    }
}
