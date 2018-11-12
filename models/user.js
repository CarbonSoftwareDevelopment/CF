const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let User = new mongoose.Schema({
    passwordHash: String,
    email: String,
    role: String,
    name: String,
    surname: String,
    forgotPassword: {
      token: String,
      expiry: Date
    },
    fileIDs: [{type: Schema.Types.ObjectId, ref: 'files'}],
    milestoneLists: [{type: Schema.Types.ObjectId, ref: 'milestoneLists'}],
    properties: {type: Schema.Types.ObjectId, ref: 'properties'}
  },
  {
    collection: 'users'
  });

module.exports = mongoose.model('User', User);

