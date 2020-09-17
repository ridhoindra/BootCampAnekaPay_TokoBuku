const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    nama: { type: String },
    email: { type: String },
    password: { type: String },
    status: {type: String, default: 'user'},
    created_at: { type: Date }
  });

module.exports = mongoose.model('user',userSchema)