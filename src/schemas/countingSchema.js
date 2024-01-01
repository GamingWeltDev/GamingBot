const { model, Schema } = require('mongoose');

module.exports = model('countingSchema',
    new Schema({
      Guild: String,
      Channel: String,
      Number: Number,
      LastUser: String,
    })
);