'use strict'

var mongoose = require('mongoose');
var jwt = require('jwt-simple');
var moment = require('moment');

var JWT_SECRET = process.env.JWT_SECRET;


var statusTypes = ['unlisted', 'listed', 'requested'];

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
  },
  listed: { type: Boolean},
  requested: {type: Boolean}
});


itemSchema.statics.trade = function (tradeObj, cb) {

  Item.findById(tradeObj._id, function(err, item){
    if(err) res.status(400).send(err);
    console.log(item);
    item.ownerId = tradeObj.requesterId;
    item.requesterId = tradeObj.ownerId;
    item.listed = true;
    item.requested = false;
    item.save(cb);
    res.redirect('/profile');

  });

};

itemSchema.statics.traderequest = function (tradeObj, cb) {

  Item.findById(tradeObj._id, function(err, item){
    if(err) res.status(400).send(err);
    console.log(item);
    item.requesterId = tradeObj.requesterId;
    item.listed = false;
    item.requested = true;
    item.save(cb);
    res.redirect('/profile');

  });

};


Item = mongoose.model('Item', itemSchema);

module.exports = Item;
