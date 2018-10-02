const { Schema } = require('mongoose');

const Ram = new Schema({
  quote: { type: Number, index: true },
  base: { type: Number, index: true },
  date: {
    index: true,
    type: Date,
    default: Date.now,
  },
}, { collection: 'Ram' });

module.exports = Ram;
