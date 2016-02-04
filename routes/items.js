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
router.get('/browse', User.isLoggedIn, function(req, res, next){

  Item.find({listed: true}, function(err, items){
    if(err) res.status(400).send(err);
    var userId = req.token._id;
    res.render('browse', {itemsArray: items, userId: userId});
  })
});





router.get('/tradereq/:itemId/:userId', User.isLoggedIn, function(req, res, next){

  var itemId = req.params.itemId;

  console.log(itemId);

  Item.findById(itemId, function(err, item){
    if(err) res.status(400).send(err);
    console.log(item);
    item.requesterId = req.params.userId;
    item.listed = false;
    item.requested = true;
    item.save(function(err){
      if(err) res.status(400).send(err);
    });
    res.redirect('/users/profile');

  });

});


// router.get('/trade/:itemId/:userId', User.isLoggedIn, Item.traderequest, function(req, res, next){
//
//   Item.findById(tradeObj._id, function(err, item){
//     if(err) res.status(400).send(err);
//     console.log(item);
//     item.requesterId = tradeObj.requesterId;
//     item.listed = false;
//     item.requested = true;
//     item.save(cb);
//     res.redirect('/profile');
//
//   });
//
// });



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
router.get('/:itemId', User.isLoggedIn, function(req, res, next){
  Item.findById(req.params.itemId).populate('ownerId requesterId').exec(function(err, item){
    if(err) res.status(400).send(err);
    console.log(item);
    var userId = req.token._id;
    res.render('item', {itemData: item, userId: userId});

  });
});
// WE WILL BUILD GET ROUTE FOR SINGLE ITEM IF WE CHOOSE TO USE JQUERY FOR RENDER
// router.get('/', User.isLoggedIn, function(req, res, next){
//   var userId = req.query.ownerId;
//   res.render('profile', {})
// });





module.exports = router;
