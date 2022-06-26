const {Client, Message, MessageEmbed} = require("discord.js");

module.exports = {
    name: `report`,
    category: "utility",
    description: "Report a user to the moderators. Only the moderators will see your name and report.\nAbuse of the command will result in an instant ban.\nTo report a DM you have to use //report in DM with Ayanami\nTo report a message in a channel you have to use //report on the server. Your message will be deleted to keep your privacy.",
    args: false,
    usage: `\nFOR DMS: <Offender's DiscordTag#1234 and/or ID (Developer Mode)> <Chat Screenshot (Attachment only)>\nFOR CHANNELS: <Offending message's Link (Right click message and copy message link)>`,
    /**
     * 
     * @param {Client} ayanami 
     * @param {Message} message 
     * @param {Array} args 
     */
    execute(ayanami, message, args) {
        let report_channel = ayanami.channels.cache.get("693069041996267550"),
        reporter = message.author,
        mod_role = "<@&421708736478969866>";

        if (message.channel.type === "DM") {
            let offender = args.join(" ");

            if (!offender) return message.channel.send("You must provide the offender's DiscordTag#1234 or user ID (accessible by enabling Developer Mode, right clicking the user and copying ID).");
            if (!message.attachments || message.attachments.size === 0) return message.channel.send("You must provide a screenshot of the offending DM messages.");

            let screenshot = message.attachments;
            let embed = new MessageEmbed()
            .setAuthor({name: reporter.tag, iconURL: reporter.displayAvatarURL()})
            .setTitle("DM report")
            .setDescription(`**${reporter.tag}** reported **${offender}** for sending inappropriate messages in DM. *Check Screenshot*`)
            .setImage(screenshot.first().proxyURL)
            .setTimestamp()
            .setColor("AQUA")

            report_channel.send({content: `${mod_role} there is a new report.`, embeds: [embed]})
        }
        else if (message.channel.type !== "DM") {
            let message_URL = args.join(" ");

            if (!message_URL) return message.author.send("You must provide the URL of the offending message (right click the message and copy message link)")
            .catch(() => {
                message.delete();
                return report_channel.send(`${mod_role} **${reporter.tag}** tried to report a message in <#${message.channelId}> but forgot to provide the message link and has DMs blocked.`);
            })


            let embed = new MessageEmbed()
            .setAuthor({name: reporter.tag, iconURL: reporter.displayAvatarURL()})
            .setTitle("Channel report")
            .setDescription(`**${reporter.tag}** reported a message in <#${message.channelId}>`)
            .addField("Message URL", message_URL)
            .setTimestamp()
            .setColor("BLUE")

            message.delete();
            report_channel.send({content: `${mod_role} there is a new report.`, embeds: [embed]})
        }
    }
}