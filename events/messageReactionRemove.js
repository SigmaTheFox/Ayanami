const { RolesDB } = require('../modules/dbObjects');

module.exports = async (ayanami, react, user) => {
  if (user.bot) return

  if (react.message.channel.name === 'roles') {
    const member = await react.message.guild.members.fetch(user.id);
    const findRole = react.message.guild.roles.cache;

    RolesDB.findOne({ where: { emote: react.emoji.name } }).then((Role) => {
      if (!Role) return;
      member.roles.remove(findRole.find((r) => r.name === Role.role));
    })
  }
}
