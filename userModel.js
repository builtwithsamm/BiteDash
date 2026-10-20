const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  fullname: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, default: "" }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);
