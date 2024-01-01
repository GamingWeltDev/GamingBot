const { log } = require("../../functions");
const ExtendedClient = require('../../class/ExtendedClient');

module.exports = {
    event: 'ready',
    once: true,
    /**
     * 
     * @param {ExtendedClient} _ 
     * @param {import('discord.js').Client<true>} client 
     * @returns 
     */
    run: (_, client) => {
        log('Eingeloggt als: ' + client.user.tag, 'done');
    }
};