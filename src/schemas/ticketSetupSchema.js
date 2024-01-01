const { model, Schema } = require('mongoose');

module.exports = model('ticket-setup',
    new Schema({
        guildID: String,
        feedbackChannelID: String,
        ticketChannelID: String,
        staffRoleID: String,
        ticketType: String,
    })
);