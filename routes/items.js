var express = require('express');
var router = express.Router();

var Item = require('../models/item');

//var Item;

/* GET home page. */
router.post('/', function(req, res, next) {
  var newItem = req.body;

  Item.create(newItem, function(err, savedItem){
    if (err) res.status(400).send('Failed to save new user.');
    res.send('New item saved.');
  });

});

router.delete('/:itemId', function(req, res, next){
  Item.findByIdAndRemove(req.params.itemId, function(err, item){
    if(err) res.status(400).send(err);
    res.send('Item deleted.');
  })
});

// WE WILL BUILD GET ROUTE FOR SINGLE ITEM IF WE CHOOSE TO USE JQUERY FOR RENDER
// router.get('/', User.isLoggedIn, function(req, res, next){
//   var userId = req.query.ownerId;
//   res.render('profile', {})
// });





module.exports = router;