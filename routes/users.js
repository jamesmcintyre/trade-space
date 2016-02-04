var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Item = require('../models/item');

/* GET users listing. */
router.post('/register', function(req, res, next) {
  User.register(req.body, function(err, savedUser) {
    res.status(err ? 400 : 200).send(err || savedUser);
  });
});

router.post('/login', function(req, res, next){
  User.login(req.body, function(err, token){
    //res.status(err ? 400 : 200).cookie('userToken', token).send()
    if(err) {
      res.status(400).send(err);
    }
    else{
      console.log(token);
      res.cookie('userToken', token).send('logged in');
    }
  });
});

router.get('/profile', User.isLoggedIn, function(req, res){
  //REQ.TOKEN IS THE COOKIE TOKEN
  User.findById(req.token._id, function(err, user){
    //WE HAVE THE USER NOW
    var userId = user._id;
    //NOW WE NEED TO TAKE THE USER ID AND RUN A FIND IN MONGO TO FIND USER'S TIMES (OWNS)
    //WE WILL THEN SEND THE ARRAY OF ITEM TO THE PROFILE JADE VIEW FOR RENDER

    Item.find({'ownerId': userId}, function(err, data){
      if(err) res.status(400).send(err);
      
      res.render('profile', {userData: user, itemsArray: data});

    })


    // res.send(user);

  });
});

// .replace(/\"/g, "");

// router.get('/', User.isLoggedIn, function(req, res, next){
//   var userId = req.query.ownerId;
//   res.render('profile', {})
// });




module.exports = router;
