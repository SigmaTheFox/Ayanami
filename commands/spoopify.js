const Canvas = require("canvas");
const Discord = require('discord.js');

module.exports = {
  name: "spoopify",
  category: "random",
  description: "I will make you very spooky.",
  aliases: ["spoop"],
  locked: true,
  event: "Halloween",
  async execute(ayanami, message, args) {
    message.channel.startTyping();

    const canvas = Canvas.createCanvas(500, 500);
    const ctx = canvas.getContext('2d');

    const background = await Canvas.loadImage('./images/spoopify/background.jpg');
    const cobWebs = await Canvas.loadImage('./images/spoopify/cobwebs.png');
    const bloodBorder = await Canvas.loadImage('./images/spoopify/blood_border.png');
    const avatar = await Canvas.loadImage(message.author.displayAvatarURL({ format: 'png', size: 2048 }));

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(avatar, 50, 50, canvas.width - 100, canvas.height - 100);
    ctx.drawImage(bloodBorder, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(cobWebs, 0, 0, 209, 220);

    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'spoopy.jpg');
    message.reply(`You're very spoopy now!`, { files: [attachment] })
      .then(result => {
         ayanami.logger.info(`${message.author.username} requested a spoop image`);
        message.channel.stopTyping();
      })
  }
}
