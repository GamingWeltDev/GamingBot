const { connect } = require("mongoose");
const config = require("../config");
const { log } = require("../functions");
const Levels = require("discord.js-leveling");

module.exports = async () => {
    log('Die Verbindung zu MongoDB wird hergestellt...', 'warn');

    await connect(process.env.MONGODB_URI || config.handler.mongodb.uri).then(() => {
        log('MongoDB ist mit dem Atlas verbunden!', 'done')

        //Levels.setURL(process.env.MONGODB_URI);
    });
};