module.exports = {
  name: `help`,
  aliases: [`commands`],
  execute(ayanami, message, args) {
    const Discord = require('discord.js');
    // Imports the emojis database file and gives them a name used to call them.
    const Emote = require("../emojis.json");
    const VampireLewd = ayanami.emojis.cache.get(Emote.vampirelewd);
    const AyanamiHeart = ayanami.emojis.cache.get(Emote.ayanamiheart);
    const DvaPatPat = ayanami.emojis.cache.get(Emote.dvapatpat);
    const Bully = ayanami.emojis.cache.get(Emote.surebully);

    // 22 out of 25 fields
    const permaCmd = new Discord.MessageEmbed()
      .setAuthor(ayanami.user.username, ayanami.user.displayAvatarURL({ format: 'png', size: 2048 }))
      .setColor(45055)
      .setTitle("Here are all my commands!")
      .addFields(
      { name: "//recommend <-Type> <-Anonymosity> <Suggestion>", value: "Recommend a change to the server or a render. Use `-help` as type to get further instructions." },
      { name: "//weather <City name>", value: `I'll tell you what weather it is`},
      { name: "//choose <option 1 | option 2 ...>", value: `I will pick for you.`},
      { name: "//baka", value: `It's not like I... Whatever.` },
      { name: "//pat", value: `Pat and everything's fine again. ${DvaPatPat}` },
      { name: "//hug", value: `Hugs are great! ${AyanamiHeart}` },
      { name: "//cuddle", value: `You might think cudding is lewd, but no, cuddling is our source of energy! ${AyanamiHeart}` },
      { name: "//tickle", value: `Bully them with tickles! ${Bully}` },
      { name: "//poke", value: `Squishy :3` },
      { name: "//lick", value: `Lick your friends! Don't worry, it's not lewd or cannibalism :)` },
      { name: "//nom", value: `Wanna have a bite?` },
      { name: "//kiss", value: `Give someone a big ol' smooch` },
      { name: "//fuck", value: `Fuck someone either out of love or because you're feeling horny.` },
      { name: "//lewd", value: `Don't say such lewd things!` },
      { name: "//source <Image attachment/link>", value: "Find the ketchup of an image" },
      { name: "//osuset <username>", value: `You can store your OSU username for future uses with this command` },
      { name: "//osu | //taiko | //mania | //ctb (Username)", value: `I'll give you stats about your or someone else's OSU! account` },
      { name: "//google <Search word>", value: `I will send you a random image of whatever you typed.` },
      { name: "//meme", value: `Get random memes from Reddit` },
      { name: "//db", value: `I see what you're doing there. ${VampireLewd} \n **Use 'rating:explicit', 'rating:quetionable' or 'rating:safe' to get a random image of the respective category.**` },
      { name: "//gb <Tag>", value: `Use this one instead of db for multiple tags.` },
      { name: "//r34 <Tag>", value: `Really? gelbooru wasn't enough?` })
      // { name: "//signup <Game username>", value: `Use this to sign up to the next tournament or change your used game tag!` },
      // { name: "//unsign", value: `In case you don't want to participate at the tournament anymore, you can use this command.` })

      // 2 out of 25 fields (EVENT COMMANDS)
      const eventCmd = new Discord.MessageEmbed()
      .setAuthor(ayanami.user.username, ayanami.user.displayAvatarURL({ format: 'png', size: 2048 }))
      .setColor(45055)
      .setTitle("Event commands!")
      .setDescription("These commands will only be available during special events like halloween or christmas")
      .addFields(
        { name: "//spoop", value: `I will make you very spoopy!` },
        { name: "//xmas", value: `You will become Santa!` }
      )

      // 8 out of 25 fields (ADMIN/OWNER COMMANDS)
      const adminCmd = new Discord.MessageEmbed()
      .setAuthor(ayanami.user.username, ayanami.user.displayAvatarURL({ format: 'png', size: 2048 }))
      .setColor(45055)
      .setTitle("Admin/Owner commands!")
      .addFields(
        //{ name: "//users", value: `TOURNAMENT HOST ONLY! Shows all signed up users.` },
        //{ name: "//usersclear", value: `TOURNAMENT HOST ONLY! Will clear the users list.` },
        { name: "//reload <command name>", value: `BOT OWNER ONLY! This reloads the command.` },
        { name: "//setavatar <avatar URL>", value: `BOT OWNER ONLY! This will change the avatar the avatar.` },
        { name: "//warn <@user> <reason>", value: "Warn a user. This will send a message in the admin logs channel." },
        { name: "//mute <@user> <reason>", value: "Mute a user." },
        { name: "//unmute <@user>", value: "Unmute a user." },
        { name: "//ban <@user> <reason>",  value: "Hit someone with the ban hammer." },
        { name: "//roleadd <emote | role name>", value: `Add a reaction role to the database.` },
        { name: "//roleremove <emote>", value: `Remove a reaction role from the database.` }
      )

    // Sends a message in the channel it got used in telling the user to check the help command in DMs.
    if (message.channel.type === "dm") {
      message.author.send({ embed: permaCmd })
      .then(message.author.send({ embed: eventCmd}))
      .then(message.author.send({ embed: adminCmd }));
    } else {
      message.reply("Ok commander... Check your DMs");
      message.author.send({ embed: permaCmd })
      .then(message.author.send({ embed: eventCmd }))
      .then(message.author.send({ embed: adminCmd }));
    }
  }
};
