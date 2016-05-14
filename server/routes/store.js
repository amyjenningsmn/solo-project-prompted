var router = require('express').Router();
var path = require('path');
var model = require('../../models/writing.js');
var mongoose = require('mongoose');
var passport = require('passport');
// var flash = require('connect-flash');
// I don't think I need path or mongoose. Should test/ask.


// We're at: '/store'
router.post('/', function(request, response){

  console.log('At /store request.user:', request.user);
  console.log('At /store request.session:',request.session);
  var Writing = new model({
    userId: request.user.id,
    // automatically sent with each request
    title: request.body.title,
    entryContent: request.body.entryContent
  });

  console.log('New writing selection to save to db:', Writing);

  Writing.save(function(err){
    if(err){
          console.log('Error saving new Writing:', err);
          response.sendStatus(500);
        } else {
          console.log('Successfully saved new Writing!');
          response.sendStatus(200);
        }
  });

});





module.exports = router;
