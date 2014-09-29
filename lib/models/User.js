var mongoose = require('mongoose');

var UserSchema = module.exports = mongoose.Schema({
  _id: String,
  username: String
});

UserSchema.index({ username: 1 }, { unique: true });
