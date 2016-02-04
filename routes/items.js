var express = require('express');
var router = express.Router();

var Item = require('../models/item');

var User = require('../models/user');

//var Item;



//render add item view
router.get('/add', User.isLoggedIn, function(req, res, next) {
  var userToken = req.token;
  if(!userToken) res.redirect('/login')

  console.log(userToken);
  res.render('additem', {userToken: userToken});

});

//render BROWSE view
router.get('/browse', function(req, res, next){
  Item.find({listed: true}, function(err, items){
    if(err) res.status(400).send(err);
    res.render('browse', {itemsArray: items});
  })
});






//create item
router.post('/', function(req, res, next) {
  var newItem = req.body;

  console.log(newItem);

  Item.create(newItem, function(err, savedItem){
    if (err) res.status(400).send('Failed to save new user.');
    res.send('New item saved.');
  });

});

//delete item
router.delete('/:itemId', function(req, res, next){
  Item.findByIdAndRemove(req.params.itemId, function(err, item){
    if(err) res.status(400).send(err);
    res.send('Item deleted.');
  })
});

//render item detail jade view.
router.get('/:itemId', function(req, res, next){
  Item.findById(req.params.itemId, function(err, item){
    if(err) res.status(400).send(err);
    res.render('item', {itemInfo: item});
  })
});

// WE WILL BUILD GET ROUTE FOR SINGLE ITEM IF WE CHOOSE TO USE JQUERY FOR RENDER
// router.get('/', User.isLoggedIn, function(req, res, next){
//   var userId = req.query.ownerId;
//   res.render('profile', {})
// });





module.exports = router;
