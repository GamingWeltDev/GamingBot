const { model, Schema } = require('mongoose');

module.exports = model('ticket',
    new Schema({
        guildID: String,
        ticketMemberID: String,
        ticketChannelID: String,
        parentTicketChannelID: String,
        rating: Number,
        feedback: String,
        closed: Boolean,
        membersAdded: Array
    })
);