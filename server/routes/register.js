var router = require('express').Router();
var path = require('path');
var passport = require('passport');
var User = require('../../models/user');

// already at /register
router.get('/', function(request, response, next){
  response.sendFile(path.join(__dirname, '../public/views/register.html'));
});

router.get('/', function(request, response, next){
  response.json(request.isAuthenticated());
})

router.post('/', function(request, response, next){
  User.create(request.body, function (err, post) {
    if (err) {
      console.log("Aaah error", err);
      response.sendStatus(500);
      // need to do something here to redirect them to try registering again
    } else {
      next();
    }
  })
}, passport.authenticate('local', {
  successRedirect: '/home',
  // successFlash: 'Welcome to Prompted!',
  failureRedirect: '/register',
  // failureFlash: 'Invalid username or password. Try again.'

  // ^^ This next() and then passport.authenticate... let's us login right from the register screen.

}));



module.exports = router;
