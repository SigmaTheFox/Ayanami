const Canvas = require("canvas");
const Discord = require("discord.js");

module.exports = {
    name: "xmas",
    category: "random",
    description: "You will become Santa!",
    aliases: ["santa", "christmas"],
    locked: true,
    event: "Christmas",
    async execute(ayanami, message, args) {
        message.channel.sendTyping();

        const canvas = Canvas.createCanvas(500, 500);
        const ctx = canvas.getContext('2d');

        const background = await Canvas.loadImage("./images/xmas/background.jpg");
        const frame = await Canvas.loadImage("./images/xmas/frame.png");
        const hat = await Canvas.loadImage("./images/xmas/hat.png");
        const beard = await Canvas.loadImage("./images/xmas/beard.png");
        const avatar = await Canvas.loadImage(message.author.displayAvatarURL({ format: 'png', size: 2048 }));

        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 200, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(avatar, 50, 50, canvas.width - 100, canvas.height - 100);
        ctx.restore();
        ctx.drawImage(beard, 150, 280, 218, 295);
        ctx.drawImage(hat, 150, 40);
        ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);


        const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'xmas.jpg');
        message.reply({ content: `Merry Christmas Commander!!!`, files: [attachment] })
            .then(result => {
                ayanami.logger.info(`${message.author.username} requested a xmas image`);
            });
    }
}
