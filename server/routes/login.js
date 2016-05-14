var router = require('express').Router();
var path = require('path');
var passport = require('passport');
var session = require('express-session');
// ^^ lets us track our logged in user during session
var UserModel = require('../../models/user.js');


// Default Route
router.get('/', function(request, response, next){
  console.log('User', request.user);
  console.log('Is authenticated', request.isAuthenticated());
  response.sendFile(path.join(__dirname, '../public/views/login.html'));
})

// Login a user *** flash not working - stretch goal.
router.post('/',
  passport.authenticate('local', {
    successRedirect: '/home',
    // successFlash: 'Welcome to Prompted!',
    failureRedirect: '/register',
    // failureFlash: 'Invalid username or password. Try again.'

  })
);

// Route below will only be accessible once a user is logged in.
router.get('/auth', function(req, res, next){
  console.log('Requested session info for:', req.user);
      res.send(req.user);
});



module.exports = router;
