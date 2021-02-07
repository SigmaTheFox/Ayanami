module.exports = (sequelize, DataTypes) => {
    return sequelize.define('users', {
        discord_id: {
            type: DataTypes.STRING,
            unique: true,
            primaryKey: true
        },
        osu_id: {
            type: DataTypes.STRING
        },
    });
}