'use strict'

var mongoose = require('mongoose');
var jwt = require('jwt-simple');
var moment = require('moment');

var JWT_SECRET = process.env.JWT_SECRET;


var Item;

var itemSchema = mongoose.Schema({
  name: String,
  description: String,
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  requesterId: {
    type:mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});




Item = mongoose.model('Item', itemSchema);

module.exports = Item;



