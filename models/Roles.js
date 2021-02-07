module.exports = (sequelize, DataTypes) => {
    return sequelize.define('roles', {
        emote: {
            type: DataTypes.STRING,
            unique: true,
            primaryKey: true
        },
        role: {
            type: DataTypes.STRING
        },
    });
}