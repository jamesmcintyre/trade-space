'use strict'

var mongoose = require('mongoose');
var Firebase = require('firebase');
var jwt = require('jwt-simple');
var moment = require('moment');

var JWT_SECRET = process.env.JWT_SECRET;

var ref = new Firebase('https://jmmusers2.firebaseio.com/');

var User;

var userSchema = mongoose.Schema({
  uid: { type: String, required: true },
  email: { type:String, required: true},
  name: {first: String, last: String},
  iat: String,

});

userSchema.statics.register = function (userObj, cb) {
  if(!userObj.email || !userObj.password) {
    return cb('Missing required field (email, password)');
  }

  ref.createUser(userObj, function(err, userData){
    if(err) return cb(err);
    var user = new User();
    user.uid = userData.uid;
    user.email = userObj.email;
    user.save(cb);
  });
};

userSchema.statics.login = function (userObj, cb) {
  if(!userObj.email || !userObj.password) {
    return cb('Missing required field (email, password)');
  }

  ref.authWithPassword(userObj, function(err, authData){
    if(err) return cb(err);

    console.log(authData.uid);
    
    User.findOne({uid: authData.uid}, function(err, user) {
      if(err || !user) return cb(err || 'User not found in db.');
      var token = user.generateToken();
      cb(null, token);
    });
  });
};

userSchema.statics.isLoggedIn = function(req, res, next){
  //WE MIGHT HAVE PROBLEMS HERE
  var token = req.cookies.userToken;
  if(!token) return authfail('no token');

  try {
    var payload = jwt.decode(token, JWT_SECRET);
  } catch (err) {
    return authFail('decode fail');
  }

  if(moment().isAfter( moment(payload.iat, 'X').add(1, 'day') )) {
    return authFail('expiration fail');
  };

  req.token = payload;

  next();

  function authFail(err) {
    res.status(401).send({error: `Authentication failed: ${err}`})
  }

};

userSchema.methods.generateToken = function() {
  console.log('ssssssssssss',this);
  var payload = {
    uid: this.uid,
    _id: this._id,
    iat: moment().unix()
  };
  console.log('the jwt secret: ',JWT_SECRET)
  var token = jwt.encode(payload, JWT_SECRET)
  console.log('the token: ',token)
  return token;
}

User = mongoose.model('User', userSchema);

module.exports = User;

