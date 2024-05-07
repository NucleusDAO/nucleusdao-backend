const mongoose = require('mongoose');

const earlyUserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
});

const EarlyUser = mongoose.model('EarlyUser', earlyUserSchema);

module.exports = EarlyUser;
