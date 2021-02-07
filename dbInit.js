const Sequelize = require('sequelize');

// Create connection
const sequelize_osu = new Sequelize('database', 'user', 'password', {
    host: "localhost",
    dialect: 'sqlite',
    logging: false,
    storage: './database/osu.sqlite'
})

const sequelize_roles = new Sequelize('database', 'user', 'password', {
    host: "localhost",
    dialect: "sqlite",
    logging: false,
    storage: './database/roles.sqlite'
})

require("./models/Osu")(sequelize_osu, Sequelize.DataTypes);
const RolesDB = require("./models/Roles")(sequelize_roles, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize_osu.sync({ force })
    .then(async () => {
        console.log("Osu Database Synced")
        sequelize_osu.close();
    }).catch(console.error);

sequelize_roles.sync({ force })
    .then(async () => {
        const roles = [
            RolesDB.upsert({ emote: "🎨", role: "Artist" }),
            RolesDB.upsert({ emote: "🎮", role: "Free Games" }),
            RolesDB.upsert({ emote: "💮", role: "NSFW" }),
            RolesDB.upsert({ emote: "💻", role: "Programmer" }),
            RolesDB.upsert({ emote: "🎬", role: "Animator" }),
            RolesDB.upsert({ emote: "📹", role: "Streamer" }),
        ]
        await Promise.all(roles);
        console.log("Roles Database Synced");
        sequelize_roles.close();
    }).catch(console.error)