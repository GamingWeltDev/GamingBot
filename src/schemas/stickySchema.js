const { model, Schema } = require('mongoose');

module.exports = model('stickySchema',
    new Schema({
      Message: { type: String },
      ChannelID: { type: String },
      LastMessage: { type: String },
      LastMessageID: { type: String },
      MaxCount: { type: Number, default: 0 },
      CurrentCount: { type: Number, default: 0 },
    })
);